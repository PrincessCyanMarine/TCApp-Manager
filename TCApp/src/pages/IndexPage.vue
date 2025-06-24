<template>
  <q-page class="row items-center justify-evenly text-center">
    <div class="full-width q-px-md">
      <div>
        <img :src="user.avatarURL" />
      </div>
      <div class="fs-24 text-weight-medium">
        {{ user.global_name }}
      </div>
      <div>
        {{ user.username }}
        <small class="text-grey">
          {{ user.id }}
        </small>
      </div>
      <div v-if="user.admin" class="fs-24 text-primary">ADMIN</div>
      <div class="full-width q-mt-lg column items-center" style="gap: 8px">
        <q-btn v-if="user.admin" class="full-width" label="Control Panel" @click="goToControlPanel" color="primary" />
        <q-btn label="Logout" class="full-width" @click="logout" color="red" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useDiscord } from 'src/stores/discord';

const store = useDiscord();

export default {
  data: function () {
    return {};
  },
  computed: {
    user: function () {
      return store.getUser || {};
    },
  },
  watch: {
    user: function (newUser) {
      console.debug('newUser', newUser);
    },
  },
  methods: {
    logout: function () {
      store.logout();
    },
    goToControlPanel: function () {
      this.$router.push('/admin');
    },
  },
};
</script>
