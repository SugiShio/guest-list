<template lang="pug">
a.button(
  :class='[size, type, { block: !inline}]'
  @click='$emit("click")')
  slot
</template>

<script>
export default {
  props: {
    size: { type: String, default: '' },
    type: { type: String, default: '' },
    inline: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: inline-block;
  padding: 7px 20px;
  background-color: #eee;
  border-radius: 3px;
  text-align: center;
  transition: background-color 0.3s;
  cursor: pointer;
  &.block {
    display: block;
    min-width: 140px;
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
    border: 1px solid #e50012;
    &:hover {
      color: #fff;
      background-color: #e50012;
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
