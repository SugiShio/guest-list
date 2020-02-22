<template lang="pug">
div
  error(v-if='hasError')
  main.wrapper(v-show='!hasError')
    nuxt
</template>

<script>
import error from '@/components/error'
import { auth } from '~/plugins/firebase.js'
export default {
  components: { error },
  computed: {
    hasError() {
      return !!this.$store.state.error
    }
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('updateUser', {
          uid: user.uid
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
$width-wrapper: 1024px;
.wrapper {
  max-width: $width-wrapper;
  margin: auto;
}
</style>
