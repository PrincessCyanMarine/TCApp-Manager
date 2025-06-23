<template>
  <q-page class="row items-center justify-evenly">
    <q-btn label="Back" @click="goBack()" class="back-button" />
    <div class="full-width q-mt-lg column items-center" style="gap: 8px">
      <q-btn label="Commands" @click="goToCommandActivation" />
      <CommandUsageReport />
      <q-btn v-if="!status" label="Turn On" @click="turnOn" color="primary" />
      <div v-else class="full-width row justify-center" style="gap: 8px">
          <q-btn label="Turn Off" @click="turnOff" color="red" />
          <q-btn label="Restart" @click="restart" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import CommandUsageReport from 'src/components/CommandUsageReport.vue';
import { useDiscord } from 'src/stores/discord';
import { turnBotsOn, turnBotsOff, restartBots } from 'src/utils/websocket';
const store = useDiscord();

export default {
  components: {
    CommandUsageReport: CommandUsageReport,
  },
  computed: {
    user: function () {
      return store.getUser || {};
    },
    status: function () {
      return store.getStatus;
    },
  },
  mounted: function () {
    this.validateAdmin();
  },
  watch: {
    user: function () {
      this.validateAdmin();
    },
  },
  methods: {
    temp: function () {},
    goBack: function () {
      this.$router.push('/');
    },
    validateAdmin: function () {
      if (!this.user.admin) this.goBack();
    },
    goToCommandActivation: function () {
      this.$router.push('/admin/command_activation');
    },
    turnOn: function () {
      return turnBotsOn();
    },
    turnOff: function () {
      return turnBotsOff();
    },
    restart: function () {
      console.debug('restarting bots');
      return restartBots();
    },
  },
};
</script>

<style lang="scss">
.back-button {
  position: absolute;
  top: 5px;
  left: 10px;
  background: white;
}
</style>
