#!/bin/sh
npm install -g npm
npm run clean
npm ci
if [ $WWW_DOMAIN = "localhost" ]; then
npm run dev
elif [ $WWW_DOMAIN = "syonet.work" ]; then
npm run production
fi
