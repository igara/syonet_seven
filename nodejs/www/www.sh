#!/bin/sh

if [ $WWW_ENV = "local" ]; then
yarn
yarn build
yarn start
# yarn local_front_start
elif [ $WWW_ENV = "production" ]; then
yarn
yarn build
yarn start
fi
