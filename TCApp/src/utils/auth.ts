import { useDiscord } from 'src/stores/discord';
import { initializeSocket } from './websocket';

const store = useDiscord();

function getDiscordCode() {
  const code = location.hash.match(/access_token=(.+?)($|&)/)?.[1]; // location.search.match(/code=(.+?)($|&)/)?.[1];
  if (code) {
    store.setToken(code);
    // location.search = '';
    location.replace('/');
  }
  return code || store.getToken || null;
}

export function redirectToOauth() {
  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=token&redirect_uri=${process.env.REDIRECT_URI}&scope=identify+guilds`;
  history.pushState({}, '');
  location.replace(url);
}

export function getLoggedAccount() {
  const code = getDiscordCode();
  if (!code) {
    store.setUser(null);
    // redirectToOauth();
    return;
  }
  sendWebsocketLoginMessage(code);
}

function sendWebsocketLoginMessage(code: string) {
  console.debug('code', code);
  initializeSocket(code);
  //   ws.send(JSON.stringify({ type: 'login', code }));
}
