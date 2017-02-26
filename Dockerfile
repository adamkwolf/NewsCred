FROM alpine:3.1

# Update
RUN apk add --update python py-pip

# Install app dependencies
RUN pip install -r requirements.txt

# Bundle app source
COPY ext /src/ext
COPY web /src/web
COPY zappa_settings.json /src/zappa_settings.json
COPY app.py /src/app.py

EXPOSE  5000
CMD ["python", "/src/app.py", "-p 5000"]