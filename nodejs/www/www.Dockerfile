FROM node:alpine

ADD . /www
WORKDIR /www
RUN apk --update add --virtual docker
RUN chmod +x /www/www.sh
CMD ["/www/www.sh"]
