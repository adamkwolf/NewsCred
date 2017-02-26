FROM ubuntu:latest
MAINTAINER Adam Wolf "wolfadam14@gmail.com"
RUN apt-get update -y && apt-get install -y python-pip python-dev build-essential # 2017-02-25

COPY requirements.txt /requirements.txt

# Install app dependencies
RUN pip install -r requirements.txt

# Bundle app source
COPY ext /src/ext
COPY zappa_settings.json /src/zappa_settings.json
COPY app.py /src/app.py

WORKDIR /src
EXPOSE  5000
ENTRYPOINT ["python"]
CMD ["app.py"]