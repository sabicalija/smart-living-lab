<template>
  <ClientOnly>
    <div>
      <slot></slot>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  name: "VRTour",
};
</script>

<style lang="stylus" scoped></style>
