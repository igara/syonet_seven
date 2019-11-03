FROM node:alpine

ADD . /www
WORKDIR /www
RUN apk --update add --virtual docker

RUN apk --update add tzdata && \
	rm -rf /var/cache/apk/*

RUN chmod +x /www/www.sh
CMD ["/www/www.sh"]
