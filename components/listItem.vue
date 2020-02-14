<template lang="pug">
  li.listItem
    .listItem__body
      slot(name='body')
    .listItem__functions
      slot(name='functions')
</template>

<script>
export default {
  components: {}
}
</script>

<style lang="scss" scoped>
.listItem {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}
</style>
