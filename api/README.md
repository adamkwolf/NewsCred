# newscred

Running the app as a container
=====


Running the app as a container
=====

Running the app with a mysql container running with name `newscred_mysql`

```
docker run -it --link newscred_mysql:mysql -e MYSQL_HOSTNAME=mysql -p 5000:5000 newscred
```


Setup
======

Install virtual env
```
pip install virtualenv
```


Create virtual environment
```
virtualenv pyenv
```

Activate Virtual Env
```
source pyenv/bin/activate
```

install dependencies

```
pip install -r requirements.txt
```

Run MySQL in container
```
docker run -it -d --name newscred_mysql -p 3306:3306 mysql:5.7.17
docker run -it -d --name newscred_mysql -p 3306:3306 -e MYSQL_ALLOW_EMPTY_PASSWORD=true mysql:5.7.17
```

Install schema
```
python setup.py
```
