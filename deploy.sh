#!/bin/bash
nvm use 0.10
git pull
cd web
npm install
bower install
grunt build
rm -rf /usr/share/nginx/html/*
cp -r dist/* /usr/share/nginx/html
cd ..
python generator/generate_data.py
