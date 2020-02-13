<template lang="pug">
div
  header
    a(
      @click='signout'
      ) Sign Out
  div
    nuxt
</template>

<script>
import { auth } from '~/plugins/firebase.js'
export default {
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (this.$route.name === 'signin') {
          this.$router.push('/')
        }
        this.$store.dispatch('updateUser', {
          uid: user.uid
        })
      } else {
        this.$router.push('/signin')
      }
    })
  },
  methods: {
    signout() {
      auth.signOut().then(() => {
        this.$store.dispatch('signout')
        this.$router.push({ name: 'signin' })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
