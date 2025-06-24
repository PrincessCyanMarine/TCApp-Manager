import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { useDiscord } from 'src/stores/discord';
import { isGuildAdmin } from './permissions';
import type { CommandData, Guild, Role, User } from './types';

const SERVER_IP = process.env.PUBLIC_SERVER_IP;

declare global {
  interface Window {
    socket: Socket;
    watcherSocket: Socket;
  }
}

const store = useDiscord();

export function turnBotsOn() {
  window.watcherSocket.emit('turn-on');
}

export function turnBotsOff() {
  window.watcherSocket.emit('turn-off');
}

export function restartBots() {
  window.watcherSocket.emit('restart');
}

export function getCommandUsageReport(guildId?: string) {
  return new Promise<{ [key: string]: number }>((resolve) => {
    window.socket.emit('command-usage-report', guildId, resolve);
  });
}

export function getMessageReport(guildId?: string) {
  return new Promise<{ [key: string]: number }>((resolve) => {
    window.socket.emit('message-report', guildId, resolve);
  });
}

export function getXpBar(style: string, color_a: string, color_b: string) {
  return new Promise<string>((resolve) => {
    window.socket.emit('get-xpbar', style, color_a, color_b, resolve);
  });
}

export function getCommandData(guildId?: string) {
  return new Promise<
    CommandData & {
      xpBars: { [key: string]: string };
    }
  >((resolve) => {
    window.socket.emit('command-data', guildId, resolve);
  });
}

export function getCommands(guildId?: string) {
  return new Promise<unknown>((resolve) => {
    window.socket.emit('get-commands', guildId, resolve);
  });
}

export function saveCommandsActivation(
  commands: { [command: string]: boolean },
  guildId?: string | null,
) {
  return new Promise<unknown>((resolve) => {
    window.socket.emit(
      'set-disabled-commands',
      Object.entries(commands)
        .filter(([, a]) => !a)
        .map(([k]) => k),
      guildId,
      resolve,
    );
  });
}

export function saveCommandData(guildId: string, commandData: CommandData) {
  window.socket.emit('save-command-data', guildId, commandData);
}

export function setGuildModeratorRoles(guildId: string, moderatorRoles: Role[]) {
  window.socket.emit(
    'set-guild-moderator-roles',
    guildId,
    moderatorRoles?.map((role) => role.id),
    () => {},
  );
}

export function initializeSocket(code: string) {
  console.debug(`initializing socket with code ${code}`);
  const watcherSocket = io(`ws://${SERVER_IP}:4001`, {
    auth: { code },
  });
  watcherSocket.on('user', (user: string | User) => {
    console.debug('user', user);
    if (typeof user === 'string') user = JSON.parse(user) as User;
    store.setUser(user);
  });
  watcherSocket.on('bot-status', (isOn: boolean) => {
    store.setStatus(isOn);
  });
  window.watcherSocket = watcherSocket;

  const socket = io(`ws://${SERVER_IP}:4000`, {
    auth: { code },
  });
  socket.on('connect', () => { store.setStatus(true); });
  socket.on('disconnect', () => { store.setStatus(false); });
  socket.on('guilds', (guilds: string | Guild[]) => {
    console.debug('guilds', typeof guilds);
    if (typeof guilds === 'string') guilds = JSON.parse(guilds) as Guild[];
    store.setGuilds(
      guilds.map((guild) => ({
        ...guild,
        admin: isGuildAdmin(guild),
      })),
    );
  });
  socket.on('user', (user: string | User) => {
    if (typeof user === 'string') user = JSON.parse(user) as User;
    store.setUser(user);
  });

  window.socket = socket;

  // window.socket.addEventListener('message', ({ data }) => {
  //   const j = JSON.parse(data);
  //   console.debug(j);
  //   //   linksList = j.map(({ name, id }: { [key: string]: string }) => ({
  //   //     title: name,
  //   //     caption: id,
  //   //     link: '/guild',
  //   //     icon: 'record_voice_over',
  //   //   }));
  // });
}
