<template lang="pug">
section-content
  div hello
</template>

<script>
import sectionContent from '@/components/sectionContent'
export default {
  components: { sectionContent },
  created() {
    this.$store.commit('setLoaded')
  },
  mounted() {
    this.$store.commit('setLoaded')
  }
}
</script>
<style></style>
