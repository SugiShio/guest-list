<template lang="pug">
transition(name='fade')
  .loading
    span Loading...
</template>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.loading {
  @extend %fade;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: $z-index-loading;
}
</style>
