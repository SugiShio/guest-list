<template lang="pug">
section.content
  slot
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    subTitle: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 15px 20px;
}
</style>
