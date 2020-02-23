<template lang="pug">
  ul.list
    slot
</template>

<script>
import listItem from '@/components/listItem'
export default {
  components: {
    listItem
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.list {
  border-top: 1px solid $color-lightgray;
}
</style>
