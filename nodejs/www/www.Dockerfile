FROM node:alpine

ADD . /www
WORKDIR /www
RUN apk update && apk --no-cache add --virtual \
  build-dependencies \
	curl \
	build-base \
	make \
	gcc \
	g++ \
	python \
	avahi-dev

RUN apk --update add tzdata && \
	rm -rf /var/cache/apk/*

RUN chmod +x /www/www.sh
CMD ["/www/www.sh"]

