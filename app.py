from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://<username>:<password>@newscred.cbtlqiwse6cm.us-east-1.rds.amazonaws.com:3306/codefest'
db = SQLAlchemy(app)


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
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))

    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    def __repr__(self):
        return '<Author %r %r>' % (self.first_name, self.last_name)


class Site(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(80))
    website_url = db.Column(db.String(80))

    def __init__(self, company, website_url):
        self.company = company
        self.website_url = website_url

    def __repr__(self):
        return '<Site %r>' % self.company


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    url = db.Column(db.String(255))

    site_id = db.Column(db.Integer, db.ForeignKey('site.id'))
    site = db.relationship('Site', backref=db.backref('article', lazy='dynamic'))

    author_id = db.Column(db.Integer, db.ForeignKey('author.id'))
    author = db.relationship('Author', backref=db.backref('author', lazy='dynamic'))

    __table_args__ = (
        db.UniqueConstraint('url', 'site_id'),
    )

    def __init__(self, title, url, site, author):
        self.title = title
        self.url = url
        self.site = site
        self.author = author

    def __repr__(self):
        return '<Article %r>' % self.title


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Float(decimal_return_scale=2))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('article', lazy='dynamic'))

    article_id = db.Column(db.Integer, db.ForeignKey('article.id'))
    article = db.relationship('Article', backref=db.backref('article', lazy='dynamic'))

    def __init__(self, user, score, article):
        self.user = user
        self.score = score
        self.article = article

    def __repr__(self):
        return '<Rating %r>' % self.id


@app.route('/submit', methods=['POST'])
def add_rating():
    if request.method == 'POST':
        data = request.get_json()
        article_json = data['article']
        rating_json = data['rating']
        site_json = data['site']
        user_json = data['user']

        user = get_or_create_user(db.session, user_json['username'], user_json['email'])
        site = get_or_create_site(db.session, site_json['company'], site_json['url'])
        author = get_or_create_author(db.session, article_json['author_fname'], article_json['author_lname'])
        article = get_or_create_article(db.session, article_json['title'], article_json['url'], site, author)
        rating = Rating(user, rating_json['score'], article)

        db.session.add(rating)
        db.session.commit()

        return 'Rated!', 201


@app.route('/rating/<article_id>/', methods=['GET'])
def get_rating(article_id):
    if request.method == 'GET':
        sum_score = 0
        article_ratings = get_rating_by_article_id(db.session, article_id)

        for rating in article_ratings:
            sum_score += rating.score

        rating = sum_score / len(article_ratings)

        return jsonify(rating=rating), 200


def get_rating_by_article_id(session, article_id):
    ratings = session.query(Rating).filter_by(article_id=article_id).all()

    return ratings


def get_or_create_user(session, username, email):
    user = session.query(User).filter_by(username=username, email=email).first()
    if user:
        return user
    else:
        user = User(username, email)
        session.add(user)
    return user


def get_or_create_author(session, fname, lname):
    author = session.query(Author).filter_by(first_name=fname, last_name=lname).first()
    if author:
        return author
    else:
        author = Author(fname, lname)
        session.add(author)
    return author


def get_or_create_article(session, title, url, site, author):
    article = session.query(Article).filter_by(title=title, url=url, site=site, author=author).first()
    if article:
        return article
    else:
        article = Article(title, url, site, author)
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


if __name__ == '__main__':
    app.run()
