<template>
  <div style="position: relative">
    <div class="q-ml-md q-mt-md text-weight-bold text-center" style="font-size: 36px">
      {{ guild?.name || 'General' }}
    </div>

    <div v-if="exclamationCommands" class="q-mx-md">
      <div class="q-mx-md">EXCLAMATION COMMANDS</div>
      <div v-for="command of exclamationCommands" :key="command.activators[0]">
        <div v-if="isDisabled(`!${command.activators[0]}`)">
          <div class="row items-center" style="gap: 16px">
            <q-icon name="mdi-cancel" color="negative" class="q-ml-md" size="sm" />
            <span v-for="activator of command.activators" :key="activator">
              {{ activator }}
            </span>
          </div>
        </div>
        <q-toggle v-else v-model="deactivated[`!${command.activators[0]}`]">
          <div class="row items-center" style="gap: 16px">
            <span v-for="activator of command.activators" :key="activator">
              {{ activator }}
            </span>
          </div>
        </q-toggle>
      </div>
    </div>

    <div v-if="messageCommands" class="q-mx-md q-mb-xl q-pb-lg">
      <div class="q-mx-md">MESSAGE COMMANDS</div>
      <div v-for="command of messageCommands" :key="command.name">
        <div v-if="isDisabled(command.name)">
          <div class="row items-center" style="gap: 16px">
            <q-icon name="mdi-cancel" color="negative" class="q-ml-md" size="sm" />
            <span>{{ command.name }}</span>
          </div>
        </div>
        <q-toggle v-else v-model="deactivated[command.name]">
          <div class="row items-center" style="gap: 16px">
            <span>{{ command.name }}</span>
          </div>
        </q-toggle>
      </div>
    </div>
  </div>

  <div class="q-pa-md full-width bg-white" style="position: fixed; bottom: 0">
    <q-btn @click="saveCommandsActivation" label="SAVE" color="primary" class="full-width" />
  </div>
</template>

<script lang="ts">
import { useDiscord } from 'src/stores/discord';
import { isGuildAdmin, isGuildModerator } from 'src/utils/permissions';
import { getCommands, saveCommandsActivation } from 'src/utils/websocket';

const store = useDiscord();

export default {
  components: {},
  data: function () {
    return {
      // eslint-disable-next-line
      commands: null as any,
      loaded: false,
      deactivated: {} as { [command: string]: boolean },
    };
  },
  mounted: function () {
    this.getCommandData();
  },
  watch: {
    guild: function () {
      this.getCommandData();
    },
    user: function () {
      this.validateAdmin();
    },
    exclamationCommands: function (exc) {
      const deactivated = this.id
        ? this.commands.deactivatedGuild
        : this.commands.deactivatedGeneral;
      console.debug('deactivated', deactivated);
      if (deactivated)
        for (const command of exc) {
          this.deactivated[`!${command.activators[0]}`] = !deactivated.includes(
            `!${command.activators[0]}`,
          );
        }
    },
    messageCommands: function (msc) {
      const deactivated = this.id
        ? this.commands.deactivatedGuild
        : this.commands.deactivatedGeneral;
      console.debug('deactivated', deactivated);
      if (deactivated)
        for (const command of msc) {
          this.deactivated[command.name] = !deactivated.includes(command.name);
        }
    },
  },
  computed: {
    id: function () {
      return this.$route.params.id as string | null;
    },
    guild: function () {
      return store.getGuilds.find((guild) => guild.id === this.id);
    },
    user: function () {
      return store.getUser || {};
    },
    exclamationCommands: function () {
      if (!this.commands) return null;
      const res = [];
      for (const [bot, commands] of Object.entries(this.commands.activators.exclamationCommands)) {
        // eslint-disable-next-line
        for (const command of commands as any[])
          res.push({
            activators: command.activators,
            bot,
          });
      }
      return res;
    },
    messageCommands: function () {
      const res = [];
      if (this.commands)
        for (const [bot, commands] of Object.entries(this.commands.activators.messageCommands)) {
          // eslint-disable-next-line
          for (const command of commands as any[])
            if (command.dataType === 'activator')
              res.push({
                name: command.name,
                bot,
              });
        }
      return res;
    },
  },
  methods: {
    validateAdmin: function () {
      if (
        this.guild ? !isGuildAdmin(this.guild) && !isGuildModerator(this.guild) : !this.user?.admin
      ) {
        this.$router.push(this.guild ? `/guild/${this.guild.id}` : '/');
        return;
      }
    },
    getCommandData: async function () {
      this.validateAdmin();
      this.commands = await getCommands(this.guild?.id);
      console.debug('this.commands', this.commands);
      this.loaded = true;
    },
    isDisabled: function (command: string) {
      if (!this.id) return false;
      console.debug('command', command, this.commands.deactivatedGeneral.includes(command));
      return this.commands.deactivatedGeneral.includes(command);
    },
    saveCommandsActivation: function () {
      return saveCommandsActivation(this.deactivated, this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.color {
  width: 45%;
  height: 32px;
}
</style>
