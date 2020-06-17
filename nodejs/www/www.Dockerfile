FROM node:13-alpine

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
	avahi-dev \
	git \
	nss \
	freetype \
	freetype-dev \
	harfbuzz \
	ca-certificates \
	ttf-freefont

RUN apk --update add tzdata && \
	rm -rf /var/cache/apk/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN chmod +x /www/www.sh
CMD ["/www/www.sh"]
