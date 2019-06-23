#!/bin/sh

if [ "$WWW_ENV" = "production" ]; then
    rm -rf /var/lib/letsencrypt
    rm -rf /etc/letsencrypt/live/openssl
    mkdir -p /var/lib/letsencrypt
    mkdir -p /etc/letsencrypt/live/openssl

    crt_file="/etc/letsencrypt/live/openssl/fullchain.pem" &&
    key_file="/etc/letsencrypt/live/openssl/privkey.pem" &&
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

    certbot certonly -n --keep-until-expiring --agree-tos \
        --webroot --webroot-path /var/lib/letsencrypt \
        -m ${LETSENCRYPT_MAIL} -d ${WWW_DOMAIN}

    nginx -s stop
    cp /nginx/syonet.work/www.conf /etc/nginx/conf.d/default.conf
fi

echo "success: updated certification"

nginx

while true; do sleep 1; done
