<template lang="pug">
div
  .menuButton(@click='showMenu')
    span
    span
    span
  transition(name='fade')
    .menuBg(
      v-if='isMenuOpen'
      @click='closeMenu')
  nav.menuContent(:class='{ open: isMenuOpen }')
    .close
      a.close__button(@click='closeMenu')
        i.el-icon-close
    ul
      li(v-for='item in items')
        a.menuContent__item(@click='item.action') {{ item.label }}

</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false
    }
  },
  computed: {
    items() {
      const router = this.$router
      return [
        {
          label: 'Events',
          action: () => {
            this.closeMenu()
            router.push({ name: 'events' })
          }
        },
        {
          label: 'Sign out',
          action: () => {
            this.closeMenu()
            this.$emit('signout')
          }
        }
      ]
    }
  },
  methods: {
    closeMenu() {
      this.isMenuOpen = false
    },
    showMenu() {
      this.isMenuOpen = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.close {
  text-align: right;
  padding: 0 10px;
  &__button {
    @extend %hoverOpacity;
    font-size: 22px;
    padding: 10px;
  }
}
.menuButton {
  @extend %hoverOpacity;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  height: 50px;
  width: 50px;
  padding: 16px 15px;
  z-index: $z-index-menu;
  > span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: $color-accent;
    &:nth-child(2) {
      width: 75%;
    }
  }
}
.menuBg {
  @extend %fade;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(#fff, 0.7);
  z-index: $z-index-menu;
}
.menuContent {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  width: 300px;
  padding: 10px 0;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(#000, 0.1);
  z-index: $z-index-menu + 1;
  transition: transform $transition-default;
  &.open {
    transform: translateX(-100%);
  }

  &__item {
    display: block;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color $transition-default;
    &:hover {
      background-color: $color-lightgray;
    }
  }
}
</style>
