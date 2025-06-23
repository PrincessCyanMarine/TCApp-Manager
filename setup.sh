#!/bin/sh

npm i -g nodemon typescript pm2

nvm install 16.6.2

cd BotWatcher
npm i

git clone https://github.com/PrincessCyanMarine/TriviumComicsBots.git
cd TriviumComicsBots
nvm use 16.6.2 npm i

cd ../../TCApp
npm i