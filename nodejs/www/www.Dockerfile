FROM node:alpine

ADD . /www
WORKDIR /www
RUN apk --update add --virtual docker

RUN apk --update add tzdata && \
	rm -rf /var/cache/apk/*

RUN npm install
RUN chmod +x /www/www.sh
CMD ["/www/www.sh"]
