#!/bin/bash

set -ex
. $NVM_DIR/nvm.sh
nvm use 0.10
git pull
pushd web
npm install
bower install
grunt build

pushd /usr/share/nginx/html
rm -rf 404.html  bower_components  favicon.ico  images  index.html  robots.txt  scripts  styles  views

popd
cp -r dist/* /usr/share/nginx/html

popd
python generator/generate_data.py

mv dot /usr/share/nginx/html/dot
