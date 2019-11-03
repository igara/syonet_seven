FROM node:alpine

ADD . /discord
WORKDIR /discord
RUN apk --update add --virtual docker

RUN apk --update add tzdata && \
    rm -rf /var/cache/apk/*

RUN apk --no-cache add curl

RUN npm install
