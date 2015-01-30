#!/bin/bash
git pull
cd web
npm install
bower install
grunt build
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r dist/* /usr/share/nginx/html
