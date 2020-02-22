<template lang="pug">
div
  error
</template>

<script>
import error from '@/components/error'
export default {
  components: { error },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  created() {
    this.$store.commit('setError', { error: this.error })
  }
}
</script>
