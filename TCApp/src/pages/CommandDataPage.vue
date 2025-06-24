<template>
  <div style="position: relative">
    <div class="q-ml-md q-mt-md text-weight-bold text-center" style="font-size: 36px">
      {{ guild.name }}
    </div>
    <div class="q-mx-md" v-if="commandData.card">
      <q-input v-model="commandData.card.title" outlined />
      <div class="column items-center full-width">
        <div v-for="name of commandData.xpBars" :key="name" class="q-my-md">
          <q-radio v-model="commandData.card.type" :val="name">
            <XPBar :name="name" :colorA="cardColorA" :colorB="cardColorB" />
          </q-radio>
        </div>
      </div>
      <div class="column" style="gap: 16px">
        <div class="row full-width justify-around" style="gap: 16px">
          <div class="color" :style="`background-color: ${commandData.card.color}`">
            <q-menu>
              <q-color v-model="commandData.card.color" />
            </q-menu>
          </div>
          <div class="color" :style="`background-color: ${commandData.card.color2}`">
            <q-menu>
              <q-color v-model="commandData.card.color2" />
            </q-menu>
          </div>
        </div>
        <div class="row full-width justify-around" style="gap: 16px">
          <q-btn @click="getCommandData" style="width: 45%" color="negative">Cancel</q-btn>
          <q-btn @click="saveCommandData" style="width: 45%" color="primary">Save</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import XPBar from 'src/components/XPBar.vue';
import { useDiscord } from 'src/stores/discord';
import { getCommandData, saveCommandData } from 'src/utils/websocket';

const store = useDiscord();

export default {
  components: {
    XPBar: XPBar,
  },
  data: function () {
    return {
      commandData: {} as Awaited<ReturnType<typeof getCommandData>>,
      cardColorA: '#000000',
      cardColorB: '#000000',
      updateTimeout: null as NodeJS.Timeout | null,
      loaded: false,
    };
  },
  mounted: function () {
    this.getCommandData();
  },
  watch: {
    guild: function () {
      this.getCommandData();
    },
    'commandData.card.color': function () {
      if (!this.loaded) return;
      this.updateXpBar();
    },
    'commandData.card.color2': function () {
      if (!this.loaded) return;
      this.updateXpBar();
    },
  },
  computed: {
    id: function () {
      return this.$route.params.id as string;
    },
    guild: function () {
      return store.getGuilds.find((guild) => guild.id === this.id)!;
    },
  },
  methods: {
    getCommandData: async function () {
      this.commandData = await getCommandData(this.guild.id);
      if (this.commandData) {
        this.cardColorA = this.commandData.card.color;
        this.cardColorB = this.commandData.card.color2;
      }
      setTimeout(() => {
        this.loaded = true;
      }, 250);
    },
    saveCommandData: function () {
      saveCommandData(this.guild.id, this.commandData);
    },
    updateXpBar: function () {
      if (this.updateTimeout) clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        this.cardColorA = this.commandData.card.color;
        this.cardColorB = this.commandData.card.color2;
      }, 1000);
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
