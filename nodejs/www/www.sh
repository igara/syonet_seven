#!/bin/sh

yarn
yarn clear

if [ $WWW_ENV = "local" ]; then
yarn build
yarn start
# yarn local_front_start
elif [ $WWW_ENV = "production" ]; then
yarn build
yarn start
fi
