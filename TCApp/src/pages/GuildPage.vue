<template>
  <div style="position: relative">
    <div>
      <div class="q-ml-md q-mt-md text-weight-bold" style="font-size: 36px">
        {{ guild.name }}
      </div>
      <div class="q-ml-md text-weight-medium">
        <div>Moderator: {{ isModerator }}</div>
        <div>Admin: {{ isAdmin }}</div>
      </div>
      <div class="q-mx-md q-mt-lg q-mb-sm">
        <q-btn
          label="Customize Command Data"
          color="primary"
          class="full-width q-mb-sm"
          @click="goToCommandDataCustomization"
        />
        <q-btn
          v-if="isModerator || isAdmin"
          label="Activate/Deactivate Commands"
          color="negative"
          class="full-width"
          @click="goToCommandActivation"
        />
      </div>
      <CommandUsageReport class="q-px-md q-mb-sm full-width" :guildId="id" />
      <MessageReport class="q-mx-md full-width" :guildId="id" />
      <div v-if="isAdmin">
        <q-select
          v-model="moderatorRoles"
          :options="guild.roles"
          clearable
          map-options
          outlined
          multiple
          use-chips
          label="Select moderator roles"
          optionLabel="name"
          optionValue="id"
          class="q-ma-md"
        >
          <template v-slot:option="scope">
            <q-list>
              <q-item
                :style="scope.focused ? `background-color: ${scope.opt.color}22` : ''"
                clickable
                v-ripple
                v-bind="scope.itemProps"
                :focused="false"
              >
                <q-item-section>
                  <q-item-label class="q-ml-md" :style="`color: ${scope.opt.color}`">
                    <q-icon v-if="scope.selected" name="mdi-close-circle" />
                    {{ scope.opt.name }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-select>
        <div class="q-px-md">
          <q-btn label="Save moderator roles" color="positive" class="full-width" @click="saveModeratorRoles" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CommandUsageReport from 'src/components/CommandUsageReport.vue';
import MessageReport from 'src/components/MessageReport.vue';
import { useDiscord } from 'src/stores/discord';
import { isGuildAdmin, isGuildModerator } from 'src/utils/permissions';
import type { Role } from 'src/utils/types';
import { setGuildModeratorRoles } from 'src/utils/websocket';

const store = useDiscord();

export default {
  data: function () {
    return {
      moderatorRoles: [] as Role[],
    };
  },
  components: {
    CommandUsageReport: CommandUsageReport,
    MessageReport: MessageReport,
  },
  mounted: function () {
    this.getModeratorRoles();
  },
  watch: {
    guild: function () {
      this.getModeratorRoles();
    },
  },
  computed: {
    id: function () {
      return this.$route.params.id as string;
    },
    guild: function () {
      return store.getGuilds.find((guild) => guild.id === this.id)!;
    },
    isAdmin: function () {
      return isGuildAdmin(store.getGuilds.find((guild) => guild.id === this.id)!);
    },
    isModerator: function () {
      return isGuildModerator(store.getGuilds.find((guild) => guild.id === this.id)!);
    },
  },
  methods: {
    getModeratorRoles: function () {
      this.moderatorRoles = this.guild.roles.filter((role) => role.moderator);
    },
    saveModeratorRoles: function () {
      setGuildModeratorRoles(this.guild.id, this.moderatorRoles);
    },
    goToCommandDataCustomization: function () {
      this.$router.push(`/guild/${this.id}/command_data`);
    },
    goToCommandActivation: function () {
      this.$router.push(`/guild/${this.id}/command_activation`);
    },
  },
};
</script>
