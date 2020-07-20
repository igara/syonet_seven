#!/bin/sh

if [ $NPM_INSTALL = "1" ]; then
npm install -g npm
npm run clean:all
npm ci
npm run sw:build
npm run build
fi
if [ $WWW_DOMAIN = "localhost" ]; then
npm run dev
elif [ $WWW_DOMAIN = "local.syonet.work" ]; then
npm run dev
elif [ $WWW_DOMAIN = "syonet.work" ]; then
export NODE_ENV=production
npm run start
fi
