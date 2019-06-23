#!/bin/sh

if [ "$WWW_ENV" = "production" ]; then
    if [ ! -d "/etc/letsencrypt/live/${WWW_DOMAIN}" ]; then
        mkdir -p /etc/letsencrypt/live/${WWW_DOMAIN}
        mkdir -p /var/lib/letsencrypt
    fi

    crt_file="/etc/letsencrypt/live/${WWW_DOMAIN}/fullchain.pem" &&
    key_file="/etc/letsencrypt/live/${WWW_DOMAIN}/privkey.pem" &&
    subject="${LETSENCRYPT_SUBJECT}" &&
    openssl req -new -newkey rsa:2048 -sha256 -x509 -nodes \
        -set_serial 1 \
        -days 3650 \
        -subj "$subject" \
        -out "$crt_file" \
        -keyout "$key_file" &&
    chmod 400 "$key_file"

    cp /nginx/syonet.work/cert.conf /etc/nginx/conf.d/default.conf
    nginx

    if [ ! -e "/etc/letsencrypt/initialize" ]; then
        rm -rf /etc/letsencrypt/live/${WWW_DOMAIN}
        certbot certonly -n --keep-until-expiring --agree-tos \
            --webroot --webroot-path /var/lib/letsencrypt \
            -m ${LETSENCRYPT_MAIL} -d ${WWW_DOMAIN}
    fi

    touch /etc/letsencrypt/initialize
    certbot renew

    nginx -s stop
    cp /nginx/syonet.work/www.conf /etc/nginx/conf.d/default.conf
fi

echo "success: updated certification"

nginx

while true; do sleep 1; done
