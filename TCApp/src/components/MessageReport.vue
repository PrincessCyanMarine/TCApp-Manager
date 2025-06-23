<template>
  <div>
    <div class="full-width text-center q-px-md">
      <div v-if="!messageReport" class="q-mt-md q-ml-md">No message data available</div>
      <q-btn
        v-else
        :label="`Message Statistics`"
        @click="
          isMessageReportDialogOpen = true;
          getMessageReport();
        "
        color="dark grey"
        class="full-width"
      />
    </div>
    <div
      v-if="isMessageReportDialogOpen"
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
          @click="isMessageReportDialogOpen = false"
          class="back-button"
          style="z-index: 999"
        />
        <div class="absolute" style="top: 0; left: 0; right: 0; bottom: 0; z-index: 9">
          <template v-if="messageReport">
            <q-virtual-scroll
              :items="Object.entries(messageReport)"
              separator
              style="max-height: calc(100vh - 75px)"
              class="text-center bg-white"
            >
              <template v-slot:before><div class="q-py-lg" /> </template>
              <template v-slot="{ item: [key, value], index }">
                <q-item :key="index" class="row">
                  <div>
                    <span>{{ +key + 1 }}</span>
                  </div>
                  <div class="row items-center full-width">
                    <img
                      style="width: 64px; border-radius: 100%"
                      :src="value.avatar"
                      class="q-mx-md"
                    />
                    <div class="column items-start text-left" style="width: 75%">
                      <div class="text-weight-bold text-ellipsis" style="font-size: 24px">
                        {{ value.displayName }}
                      </div>
                      <div>{{ value.messages }}</div>
                    </div>
                  </div>
                </q-item>
              </template>
            </q-virtual-scroll>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getMessageReport } from 'src/utils/websocket';

export default {
  watch: {
    guildId: function () {
      this.getMessageReport();
    },
  },
  props: {
    guildId: {
      type: String,
      required: false,
    },
  },
  data: function () {
    return {
      messageReport: null as { [key: string]: number } | null,
      isMessageReportDialogOpen: false,
    };
  },
  mounted: function () {
    this.getMessageReport();
  },
  methods: {
    getMessageReport: async function () {
      this.messageReport = await getMessageReport(this.guildId);
      console.debug('this.messageReport', this.messageReport);
      if (!this.messageReport) {
        this.isMessageReportDialogOpen = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.back-button {
  position: absolute;
  top: 5px;
  left: 10px;
  background: white;
}

.text-ellipsis {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
