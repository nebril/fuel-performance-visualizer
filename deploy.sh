#!/bin/bash
nvm use 0.10
git pull
cd web
grunt build
rm -rf /usr/share/nginx/html/*
cp -r dist/* /usr/share/nginx/html
python generator/generate_data.py
