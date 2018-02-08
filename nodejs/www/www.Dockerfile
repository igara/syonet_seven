FROM node:alpine

ADD . /www
WORKDIR /www
RUN chmod +x /www/www.sh
CMD ["/www/www.sh"]
