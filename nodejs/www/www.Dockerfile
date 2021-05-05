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
	avahi-dev \
	git \
	nss \
	freetype \
	freetype-dev \
	harfbuzz \
	ca-certificates \
	ttf-freefont \
	cairo-dev \
	jpeg-dev \
	pango-dev \
	giflib-dev

RUN apk --update add tzdata && \
	rm -rf /var/cache/apk/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
RUN if [ $NPM_INSTALL = "1" ]; then \
npm install -g npm && \
npm run clean:all && \
npm ci ; \
fi

CMD ["npm", "run", "start"]
