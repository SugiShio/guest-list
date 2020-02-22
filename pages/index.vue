<template lang="pug">
  div hello
</template>

<script>
export default {
  created() {
    this.$store.commit('setLoaded')
  }
}
</script>
<style></style>
