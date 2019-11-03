FROM node:alpine

ADD . /www
WORKDIR /www
RUN apk --update add --virtual docker

RUN apk --update add tzdata && \
	rm -rf /var/cache/apk/*

RUN npm install
