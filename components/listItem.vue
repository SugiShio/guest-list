<template lang="pug">
  li.listItem
    .listItem__body(ref='body')
      slot(name='body')
      .listItem__button(
        v-if='actions.length'
        @click='toggleActions') ...
    .listItem__actions()
      a.listItem__action(
        v-for='action in actions'
        ref='actions'
        :class='action.color'
        @click='action.action') {{ action.label }}
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.showActions = false
    this.widthActions = Array.from(this.$refs.actions).reduce(
      (acc, element) => element.clientWidth + acc,
      0
    )
  },
  methods: {
    toggleActions() {
      this.showActions = !this.showActions
      const offset = this.showActions ? this.widthActions : 0
      this.$refs.body.style.transform = `translateX(-${offset}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables';
.listItem {
  position: relative;
  border-bottom: 1px solid #eee;

  &__body {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding: 0 20px;
    background-color: #fff;
    transition: transform 0.5s, background-color $transition-default;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__action {
    background-color: #fff;
    padding: 10px 15px;
    &.red {
      background-color: $color-accent;
      color: #fff;
    }
  }
}
</style>
