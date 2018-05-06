FROM node:alpine

ADD . /www
WORKDIR /www
RUN apk --update add --virtual docker

RUN apk --no-cache add openssl && \
    wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && \
    chmod +x /usr/local/bin/dumb-init && \
    apk del openssl && \
    apk --no-cache add ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.25-r0/glibc-2.25-r0.apk && \
    apk add glibc-2.25-r0.apk

RUN chmod +x /www/www.sh
CMD ["/www/www.sh"]
