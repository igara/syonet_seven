#!/bin/sh

docker-compose up -d
docker-compose exec www yarn flow
docker-compose down
