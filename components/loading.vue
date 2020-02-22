<template lang="pug">
transition(name='fade')
  .loading
    span Loading...
</template>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables';
.loading {
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
  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity $transition-default;
  }
  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }
}
</style>
