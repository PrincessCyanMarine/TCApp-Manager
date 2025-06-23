import { defineStore, acceptHMRUpdate } from 'pinia';
import { SessionStorage } from 'quasar';
import type { Guild, User } from 'src/utils/types';

export const useDiscord = defineStore('myStore', {
  state: () => ({
    guilds: [] as Guild[],
    user: null as User | null | undefined,
    loaded: false,
    token: null as string | null | undefined,
    status: false,
  }),
  getters: {
    getGuilds: (state) => state.guilds || JSON.parse(SessionStorage.getItem('GUILDS') || 'null'),
    getUser: (state) => state.user || JSON.parse(SessionStorage.getItem('USER') || 'null'),
    getStatus: (state) => state.status || JSON.parse(SessionStorage.getItem('STATUS') || 'false'),
    isUserLoaded: (state) => state.loaded,
    getToken: (state) =>
      state.token || (SessionStorage.getItem('DISCORD_TOKEN') as string | undefined),
  },
  actions: {
    setGuilds(guilds: Guild[] = []) {
      if (guilds) SessionStorage.setItem('GUILDS', JSON.stringify(guilds));
      else SessionStorage.remove('GUILDS');
      this.guilds = guilds;
    },
    setStatus(isOn?: boolean) {
      if (isOn) SessionStorage.setItem('STATUS', JSON.stringify(isOn));
      else SessionStorage.remove('STATUS');
      this.status = !!isOn;
    },
    setUser(user?: User | null) {
      if (user) SessionStorage.setItem('USER', JSON.stringify(user));
      else SessionStorage.remove('USER');
      this.user = user;
      this.setLoaded();
    },
    setLoaded() {
      this.loaded = true;
    },
    setToken(token?: string | null) {
      if (token) SessionStorage.setItem('DISCORD_TOKEN', token);
      else SessionStorage.remove('DISCORD_TOKEN');
      this.token = token;
    },
    logout() {
      this.setToken();
      this.setUser();
      this.setGuilds();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDiscord, import.meta.hot));
}
