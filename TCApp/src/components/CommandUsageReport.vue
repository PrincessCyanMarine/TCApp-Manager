<template>
  <div v-if="show">
    <div class="full-width text-center">
      <div v-if="!commandUsageReport" class="q-mt-md q-ml-md">No command usage data available</div>
      <q-btn
        v-else
        :label="`Command Usage`"
        @click="
          isCommandUsageReportDialogOpen = true;
          getCommandUsageReport();
        "
        color="dark grey"
        class="full-width"
      />
    </div>
    <div
      v-if="isCommandUsageReportDialogOpen"
      style="
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 50;
      "
    >
      <div>
        <q-btn
          label="Back"
          @click="isCommandUsageReportDialogOpen = false"
          class="back-button"
          style="z-index: 999"
        />
        <div class="absolute" style="top: 0; left: 0; right: 0; bottom: 0; z-index: 9">
          <template v-if="commandUsageReport">
            <q-virtual-scroll
              type="table"
              :items="Object.entries(commandUsageReport).sort(([, a], [, b]) => b - a)"
              separator
              style="height: calc(100vh - 75px); border: none; box-shadow: none"
              class="text-center"
            >
              <template v-slot:before>
                <thead class="thead-sticky bg-white">
                  <tr>
                    <th>COMMAND</th>
                    <th>USES</th>
                  </tr>
                </thead>
              </template>

              <template v-slot="{ item: [key, value], index }">
                <tr :key="index">
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                </tr>
              </template>
            </q-virtual-scroll>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getCommandUsageReport } from 'src/utils/websocket';
import { useDiscord } from 'src/stores/discord';
import { isGuildAdmin, isGuildModerator } from 'src/utils/permissions';

const store = useDiscord();

export default {
  watch: {
    guildId: function () {
      this.commandUsageReport = null;
      this.getCommandUsageReport();
    },
  },
  props: {
    guildId: {
      type: String,
      required: false,
    },
  },
  computed: {
    show: function () {
      if (!this.guildId) return true;
      const guild = store.getGuilds.find((guild) => guild.id === this.guildId);
      if (!guild) return false;
      return isGuildAdmin(guild) || isGuildModerator(guild);
    },
  },
  data: function () {
    return {
      commandUsageReport: null as { [key: string]: number } | null,
      isCommandUsageReportDialogOpen: false,
    };
  },
  mounted: function () {
    this.getCommandUsageReport();
  },
  methods: {
    getCommandUsageReport: async function () {
      this.commandUsageReport = await getCommandUsageReport(this.guildId);
      if (!this.commandUsageReport) {
        this.isCommandUsageReportDialogOpen = false;
      }
    },
  },
};
</script>

<style lang="scss">
.thead-sticky tr > *,
.tfoot-sticky tr > * {
  position: sticky;
  opacity: 1;
  z-index: 1;
  background: white !important;
  color: black !important;
}

.thead-sticky tr:last-child > * {
  top: 0;
}
.tfoot-sticky tr:first-child > * {
  bottom: 0;
}

.back-button {
  position: absolute;
  top: 5px;
  left: 10px;
  background: white;
}
</style>
