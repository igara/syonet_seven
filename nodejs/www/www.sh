#!/bin/sh
npm install
if [ $NODE_ENV = "localhost" ]; then
npm run dev
elif [ $NODE_ENV = "production" ]; then
npm run production
fi
