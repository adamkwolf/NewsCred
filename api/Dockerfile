FROM ubuntu:latest
MAINTAINER Adam Wolf "wolfadam14@gmail.com"
RUN apt-get update -y && apt-get install -y python-pip python-dev build-essential netcat # 2017-02-25-3

COPY requirements.txt /requirements.txt

# Install app dependencies
RUN pip install -r requirements.txt

# Bundle app source
COPY ext /src/ext
COPY zappa_settings.json /src/zappa_settings.json
COPY setup.py /src/setup.py
COPY app.py /src/app.py
COPY entry-point.sh /src/entry-point.sh

WORKDIR /src
EXPOSE  5000
CMD ["/src/entry-point.sh"]