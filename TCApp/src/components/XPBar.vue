<template>
  <div v-if="xpBarSrc" style="max-width: 70vw" class="row items-center">
    <img :src="xpBarSrc" style="max-width: 100%; height: auto" />
  </div>
  <div v-else>Loading...</div>
</template>

<script lang="ts">
import { getXpBar } from 'src/utils/websocket';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    colorA: {
      type: String,
      required: true,
    },
    colorB: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      xpBarSrc: null as string | null,
    };
  },
  mounted: function () {
    this.getXpBar();
  },
  watch: {
    colorA: function () {
      this.getXpBar();
    },
    colorB: function () {
      this.getXpBar();
    },
    name: function () {
      this.getXpBar();
    },
  },
  methods: {
    getXpBar: async function () {
      this.xpBarSrc = await getXpBar(this.name, this.colorA, this.colorB);
      console.debug('this.xpBarSrc', this.xpBarSrc);
    },
  },
};
</script>

<style lang="scss" scoped></style>
