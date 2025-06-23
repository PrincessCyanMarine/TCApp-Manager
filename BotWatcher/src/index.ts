console.log('Initializing Bot Watcher')
import { config } from "dotenv";
config();

import { createServer } from "http";

import { ExtendedError, Server, Socket } from "socket.io";
import { getGuilds, getUser } from "./discordAuth";

import admin from "firebase-admin";
import { exit } from "process";
import { exec, execSync } from "child_process";
import axios from "axios";
import pm2 from 'pm2'

if (!process.env.FIREBASE_PRIVATE_KEY) exit(1);
const private_key = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: private_key,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.DATABASE_URL,
});
const database = admin.database().ref();



const port = 4001;
const server = createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const doAuth = (auth: Object) => {
  if (!('code' in auth) || !auth.code || !(typeof auth.code === 'string')) {
    return new Error('No code received');
  }
  const { code } = auth;
  console.debug('code', code);

  const token = code;
  return token;
}

var adminList = [] as string[];

database.child('admin').on('value', (data) => {
  adminList = data.val();
});

const getData = async (auth: string, next: (err?: ExtendedError) => void) => {
  console.debug('Getting data', auth);
  const data = await Promise.all([getUser('Bearer', auth), getGuilds('Bearer', auth)]);
  if (!data[1] || !Array.isArray(data[1])) {
    console.error(data);
    return next(new Error('RATE LIMITED'));
  }
  const { user } = data[0];

  return {
    user: {
      ...user,
      avatarURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
      admin: adminList.includes(user.id),
    }
  }
}

io.use(async (socket, next) => {
  const auth = doAuth(socket.handshake.auth);
  if (typeof auth === 'string') {
    socket.handshake.auth.token = auth;
    const data = await getData(auth, next);
    if (data) {
      socket.handshake.auth.user = data.user;
      socket.emit('user', data.user);
      next();
    }
  } else next(auth);
});

const sockets = {} as {[id: string]: Socket};
const broadcast = (ev: string, ...args: any[]) => {
  console.debug('Broadcast bot state to', Object.keys(sockets).length, 'sockets', ev, args);  
  Object.values(sockets).forEach((s) => s.emit(ev, ...args));
}

const turnOn = () => {
  console.debug('Turning bots on');
  exec('source ~/.nvm/nvm.sh && cd TriviumComicsBots && nvm exec 16.6.2 pm2 start ecosystem.config.js', () => {
    setTimeout(() => {
      currentStatus = true;
      broadcast('bot-status', true);
    }, 5000);
  });
}

const turnOff = () => {
  console.debug('Turning bots off');
  exec('source ~/.nvm/nvm.sh && cd TriviumComicsBots && pm2 stop bots', () => {
    setTimeout(() => {
      currentStatus = false;
      broadcast('bot-status', false);
    }, 5000);
  });
}

const restart = () => {
  console.debug('Restarting bots');
  exec('source ~/.nvm/nvm.sh && cd TriviumComicsBots && pm2 restart bots');
}


var currentStatus = false;
const checkState = async () => {
  console.debug('checking bot state');
  let isOn = false;
  try { isOn = (await axios.get('http://localhost:4000')).data === 'ok'; } catch(ignore) {};
  console.debug('bots are ' + (isOn ? 'on' : 'off'));
  currentStatus = isOn;
  broadcast('bot-status', isOn);
  return isOn;
}


checkState().then((isOn) => {
  if (!isOn) turnOn();
})
setInterval(() => {
  checkState();
}, 60000);

io.on('connection', socket => {
  sockets[socket.id] = socket;
  socket.on('turn-off', async () => {
    const user = socket.handshake.auth.user;
    if (!user.admin || !currentStatus) return;
    turnOff();
  });
  socket.on('turn-on', async () => {
    const user = socket.handshake.auth.user;
    if (!user.admin || currentStatus) return;
    turnOn();
  });
  socket.on('restart', async () => {
    const user = socket.handshake.auth.user;
    if (!user.admin || !currentStatus) return;
    restart();
  });
  checkState();

  socket.on('disconnect', () => {
    console.debug(`Socket ${socket.id} disconnected`);
    delete sockets[socket.id];
  })

});

setTimeout(() => {
  server.listen(port, () => {
    console.log("Server is listening on http://localhost:" + port);
  });
}, 1000);




execSync('echo a')