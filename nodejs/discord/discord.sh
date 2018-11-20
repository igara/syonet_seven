#!/bin/sh

if [ $WWW_ENV = "local" ]; then
echo "localではbotを起動しません"
# yarn
# yarn start
elif [ $WWW_ENV = "production" ]; then
yarn
yarn start
fi
