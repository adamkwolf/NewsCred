#!/bin/bash

cd api
docker build -t akw54/newscred .
cd ..
cd web
docker build -t akw54/newscred-web .
cd ..
cd gateway
docker build -t akw54/newscred-gateway .
cd ..
docker push akw54/newscred
docker push akw54/newscred-web
docker push akw54/newscred-gateway