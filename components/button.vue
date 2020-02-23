<template lang="pug">
a.button(
  :class='[size, type, style]'
  :disabled='disabled'
  @click='emit')
  slot

</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    size: { type: String, default: '' },
    type: { type: String, default: '' },
    inline: { type: Boolean, default: false }
  },
  computed: {
    style() {
      return this.inline ? 'inline' : 'block'
    }
  },
  methods: {
    emit() {
      if (!this.disabled) this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.button {
  display: inline-block;
  padding: 7px 20px;
  background-color: $color-lightgray;
  border-radius: 3px;
  text-align: center;
  transition: background-color $transition-default;
  cursor: pointer;
  &.block {
    display: block;
    min-width: 160px;
  }
  &.inline + &.inline {
    margin-left: 5px;
  }
  &:hover {
    background-color: darken($color-lightgray, 5%);
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
      background-color: darken(#fff, 5%);
    }
  }
  &[disabled] {
    &,
    &:hover {
      cursor: default;
      color: $color-gray;
      border-color: $color-gray;
      background-color: #fff;
    }
  }
}
</style>
