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
.list {
  border-top: 1px solid #eee;
}
</style>
