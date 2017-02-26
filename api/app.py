import hashlib
import os
import urllib

import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

CREDENTIALS = {
    "db_user": os.environ.get('DB_USER', 'root'),
    "db_password": os.environ.get('DB_PASS', '')
}

app = Flask(__name__, static_folder='web')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
CORS(app)

MYSQL_HOST = os.environ.get('MYSQL_HOSTNAME', 'localhost')
MYSQL_SCHEMA = os.environ.get('MYSQL_SCHEMA', 'codefest')

cnx_string = 'mysql+pymysql://{}:{}@' + MYSQL_HOST + ':3306/' + MYSQL_SCHEMA
cnx_uri_string = cnx_string.format(CREDENTIALS['db_user'], CREDENTIALS['db_password'])


app.config['SQLALCHEMY_DATABASE_URI'] = cnx_uri_string
db = SQLAlchemy(app)


@app.route('/api/')
def hello_world():
    return 'Hello'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    email = db.Column(db.String(80))

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username


class Author(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Author %r>' % (self.name)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class Site(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(80))
    website_url = db.Column(db.String(80))

    def __init__(self, company, website_url):
        self.company = company
        self.website_url = website_url

    def __repr__(self):
        return '<Site %r>' % self.company

    def serialize(self):
        return {
            'id': self.id,
            'company':self.company,
            'website_url': self.website_url
        }


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    url = db.Column(db.String(255))
    snapshot = db.Column(db.Text)

    site_id = db.Column(db.Integer, db.ForeignKey('site.id'))
    site = db.relationship('Site', backref=db.backref('article', lazy='dynamic'))

    author_id = db.Column(db.Integer, db.ForeignKey('author.id'))
    author = db.relationship('Author', backref=db.backref('author', lazy='dynamic'))

    __table_args__ = (
        db.UniqueConstraint('url', 'site_id'),
    )

    def __init__(self, title, url, site, author, snapshot=None):
        self.title = title
        self.url = url
        self.site = site
        self.author = author
        self.snapshot = snapshot

    def __repr__(self):
        return '<Article %r>' % self.title

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'url': self.url,
            'site': self.site.serialize(),
            'author': self.author.serialize(),
            'snapshot': self.snapshot
        }


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Float(decimal_return_scale=2))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('article', lazy='dynamic'))

    article_id = db.Column(db.Integer, db.ForeignKey('article.id'))
    article = db.relationship('Article', backref=db.backref('article', lazy='dynamic'))

    comment = db.Column(db.Text)

    def __init__(self, user, score, article,comment):
        self.user = user
        self.score = score
        self.article = article
        self.comment = comment

    def __repr__(self):
        return '<Rating %r>' % self.id


@app.route('/api/submit', methods=['POST'])
def add_rating():
    if request.method == 'POST':
        data = request.get_json()
        article_json = data['article']
        rating_json = data['rating']
        site_json = data['site']
        user_json = data['user']


        user = get_or_create_user(db.session, user_json['username'], user_json['email'])
        site = get_or_create_site(db.session, site_json['company'], site_json['url'])
        author = get_or_create_author(db.session, article_json['author_name'])
        article = get_or_create_article(db.session, article_json['title'], article_json['url'], site, author)
        rating = Rating(user, rating_json['score'], article, rating_json['comment'])

        db.session.add(rating)
        db.session.commit()

        return 'Rated!', 201


@app.route('/api/article/<article_id>/rating', methods=['GET'])
def get_article_rating(article_id):
    if request.method == 'GET':
        rating = get_rating_by_article_id(db.session, article_id)
        return jsonify(rating=rating), 200


"""
    Author Methods
"""

@app.route('/api/author/<author_name>/', methods=['GET'])
def get_author_rating(author_name):
    if request.method == 'GET':
        author = db.session.query(Author).filter_by(name=author_name).first()

        #if we found an author by that name, do stuff

        if author:

            author_articles = db.session.query(Article).filter_by(author_id=author.id).all()

            sum_ratings = 0
            for article in author_articles:
                sum_ratings += get_rating_by_article_id(db.session, article.id)

            rating = sum_ratings / len(author_articles)

            res = {}
            res['author'] = author.serialize()
            res['rating'] = rating

            res['articles'] = [art.serialize() for art in author_articles]

            # return json.dumps(res), 200
            return jsonify(result=res), 200
        else:
            #else we found nothing
            res = {}
            res['error'] = "not found"
            return jsonify(result=res), 200

#
# @app.route('/api/author/<author_id>/rating', methods=['GET'])
# def get_author_rating(author_id):
#     if request.method == 'GET':
#         author_articles = db.session.query(Article).filter_by(author_id=author_id).all()
#
#         sum_ratings = 0
#         for article in author_articles:
#             sum_ratings += get_rating_by_article_id(db.session, article.id)
#
#         rating = sum_ratings / len(author_articles)
#
#         return jsonify(rating=rating), 200


@app.route('/api/author/list', methods=['GET'])
def get_author_list():
    if request.method == 'GET':
        response = []
        authors = db.session.query(Author).all()
        for author in authors:
            response.append(author.serialize())

        return jsonify(response), 200


@app.route('/api/article/list', methods=['GET'])
def get_article_list():
    if request.method == 'GET':
        response = []
        articles = db.session.query(Article).all()
        for article in articles:
            response.append(article.serialize())

        return jsonify(response), 200


def get_rating_by_article_id(session, article_id):
    ratings = session.query(Rating).filter_by(article_id=article_id).all()

    sum_score = 0

    for rating in ratings:
        sum_score += rating.score

    rating = sum_score / len(ratings)

    return rating


def get_or_create_user(session, username, email):
    user = session.query(User).filter_by(username=username, email=email).first()
    if user:
        return user
    else:
        user = User(username, email)
        session.add(user)
    return user


def get_or_create_author(session, fname):
    author = session.query(Author).filter_by(name=fname).first()
    if author:
        return author
    else:
        author = Author(fname)
        session.add(author)
    return author


def get_or_create_article(session, title, url, site, author):
    article = session.query(Article).filter_by(title=title, url=url, site=site, author=author).first()
    if article:
        return article
    else:
        snapshot_url = take_snapshot(url)
        article = Article(title, url, site, author, snapshot_url)
        session.add(article)
    return article


def get_or_create_site(session, company, url):
    site = session.query(Site).filter_by(company=company, website_url=url).first()
    if site:
        return site
    else:
        site = Site(company, url)
        session.add(site)
    return site


def get_or_create_rating(session, user, score, article):
    rating = session.query(Rating).filter_by(user=user, score=score, article=article)
    if rating:
        return rating
    else:
        rating = Rating(user, score, article)
        session.add(rating)
    return rating


def take_snapshot(url, **args):
    access_key = os.environ.get('SS_ACCESS_KEY', '')
    secret_keyword = os.environ.get('SS_SECRET', '')

    # encode URL
    query = urllib.urlencode(dict(url=url, width=350, format='PNG', placeholder=1, **args))

    # generate md5 secret key
    secret_key = hashlib.md5('{}{}'.format(url, secret_keyword)).hexdigest()

    url = "https://api.screenshotlayer.com/api/capture?access_key=%s&secret_key=%s&%s" % (access_key, secret_key, query)

    # make get request to preload the snapshot
    requests.get(url)

    return url


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
