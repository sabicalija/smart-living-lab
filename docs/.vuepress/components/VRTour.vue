<template>
  <ClientOnly>
    <VRScene v-if="ready" :world="data" />
  </ClientOnly>
</template>

<script>
export default {
  name: "VRTour",
  props: {
    scene: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data: null,
      ready: false,
    };
  },
  async created() {
    const resource = this.$site.base + this.scene.substring(1);
    const data = await window.fetch(resource);
    this.data = await data.json();
    this.ready = true;
  },
};
</script>

<style lang="stylus" scoped></style>
