<template lang="pug">
section.head
  h2.head__subTitle(v-if='subTitle') {{ subTitle }}
  h1.head__title(v-if='title') {{ title }}
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
.head {
  padding: 15px 20px;
  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
