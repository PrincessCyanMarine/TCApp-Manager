<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="status && user"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-btn flat dense round icon="home" aria-label="Home" @click="$router.push('/')" />
        <q-toolbar-title>
          Bot Manager
          <span v-if="user && !status" class="q-ml-sm"> (OFF) </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="status && user" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Servers </q-item-label>
        <div class="column q-mx-md">
          <div
            v-for="guild in guilds"
            :key="guild.id"
            class="row items-center q-mb-sm cursor-pointer"
            :class="isGuildAdmin(guild) ? 'text-blue' : isGuildModerator(guild) ? 'text-red' : ''"
            style="height: 32px"
            @click="openGuild(guild)"
          >
            <img :src="guild.iconURL" width="32px" class="q-mr-sm" /> <span>{{ guild.name }}</span>
          </div>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div v-if="loading" class="full-width q-mt-lg row justify-center">
        <q-spinner size="64px" />
      </div>
      <router-view v-else-if="user" />
      <div v-else class="full-width q-mt-lg row justify-center items-center q-px-md" style="height: 80vh;">
        <q-btn label="login" class="full-width" color="primary" @click="redirectToOauth" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useDiscord } from 'src/stores/discord';
import { getLoggedAccount, redirectToOauth } from '../utils/auth';
import { isGuildAdmin, isGuildModerator } from 'src/utils/permissions';
import type { Guild } from 'src/utils/types';

const store = useDiscord();
getLoggedAccount();

export default {
  components: {},
  data: function () {
    return {
      leftDrawerOpen: false,
      redirectToOauth: redirectToOauth,
    };
  },
  computed: {
    guilds: function () {
      return store.getGuilds;
    },
    status: function () {
      return store.getStatus;
    },
    loading: function () {
      return !store.isUserLoaded;
    },
    user: function () {
      return store.getUser;
    },
  },
  watch: {
    guilds: function (newGuilds) {
      console.debug('newGuilds', newGuilds);
    },
  },
  methods: {
    toggleLeftDrawer: function () {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    openGuild: function (guild: { id: string }) {
      this.$router.push(`/guild/${guild.id}`);
    },
    isGuildAdmin: function (guild: Guild) {
      return isGuildAdmin(guild);
    },
    isGuildModerator: function (guild: Guild) {
      return isGuildModerator(guild);
    },
  },
};
</script>
