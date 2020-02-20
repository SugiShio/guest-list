<template lang="pug">
section.head
  h2(v-if='subTitle') {{ subTitle }}
  .head__container
    h1.head__title {{ title }}
    div
      slot(name='functions')
  slot(name='content')
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
@import '../assets/stylesheets/utils';
.head {
  padding: 15px 20px;
  &__container {
    @include screensize-lg {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  &__title {
    font-size: 30px;
    font-weight: bold;
  }
}
</style>
