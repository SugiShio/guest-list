<template lang="pug">
div
  |{{ error }}
  error
</template>

<script>
import error from '@/components/error'
export default {
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  components: { error },
  created() {
    this.$store.commit('setError', { error: this.error })
  }
}
</script>
