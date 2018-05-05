#!/bin/sh

if [ $WWW_ENV = "local" ]; then
echo "localではbotを起動しません"
# apk update
# apk add openssh curl
# npm install -g yarn
# yarn
# yarn start
elif [ $WWW_ENV = "production" ]; then
apk update
apk add openssh curl
npm install -g yarn
yarn
yarn start
fi
