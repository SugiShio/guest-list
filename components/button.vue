<template lang="pug">
a.button(
  :class='[size, type, style]'
  @click='$emit("click")')
  slot
</template>

<script>
export default {
  props: {
    size: { type: String, default: '' },
    type: { type: String, default: '' },
    inline: { type: Boolean, default: false }
  },
  computed: {
    style() {
      return this.inline ? 'inline' : 'block'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.button {
  display: inline-block;
  padding: 7px 20px;
  background-color: #eee;
  border-radius: 3px;
  text-align: center;
  transition: background-color $transition-default;
  cursor: pointer;
  &.block {
    display: block;
    min-width: 140px;
  }
  &.inline + &.inline {
    margin-left: 5px;
  }
  &:hover {
    background-color: #ddd;
  }
  &.mini {
    font-size: 13px;
    padding: 5px 10px;
  }
  &.primary {
    background-color: transparent;
    border: 1px solid $color-accent;
    &:hover {
      color: #fff;
      background-color: $color-accent;
    }
  }
  &.weak {
    background-color: transparent;
    border: 1px solid transparent;
    &:hover {
      background-color: #eee;
    }
  }
}
</style>
