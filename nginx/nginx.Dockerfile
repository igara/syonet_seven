FROM nginx:alpine

ENV LETSENCRYPT_SUBJECT "/C=JP/ST=Tokyo/L=Toshima/CN=default"
ENV LETSENCRYPT_MAIL "igara1119@gmail.com"

ADD . /nginx
WORKDIR /nginx

RUN apk add certbot openssl
RUN chmod +x /nginx/cert.sh
CMD ["/nginx/cert.sh"]
