#!/bin/sh

if [ $WWW_ENV = "local" ]; then
# apk update
# apk add openssh sshpass
# npm install -g yarn
# yarn
# yarn start
elif [ $WWW_ENV = "production" ]; then
apk update
apk add openssh sshpass
npm install -g yarn
yarn
yarn start
fi
