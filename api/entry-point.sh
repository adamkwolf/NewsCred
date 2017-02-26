#!/bin/bash

echo "GOING TO WAIT FOR MYSQL"
until /bin/nc -z -v -w30 $MYSQL_HOSTNAME 3306
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

echo "Starting newscred server"
cd /src
python setup.py
python app.py
