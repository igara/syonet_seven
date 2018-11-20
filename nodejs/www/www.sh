#!/bin/sh

yarn
yarn clear

if [ $WWW_ENV = "local" ]; then
yarn syonet_build
yarn admin_build
yarn server_dev
elif [ $WWW_ENV = "production" ]; then
yarn syonet_build
yarn admin_build
yarn server
fi
