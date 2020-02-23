<template lang="pug">
.signin
  .signin__buttons
    g-button(
      @click='signinWithGoogle'
      inline) Sign in with Google
</template>

<script>
import gButton from '@/components/button'
import firebase, { auth } from '~/plugins/firebase.js'
const provider = new firebase.auth.GoogleAuthProvider()

export default {
  layout: 'public',
  components: { gButton },
  created() {
    if (this.$store.state.isSignin) {
      this.$router.push('/')
    }
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('updateUser', {
          uid: user.uid
        })
        this.$router.push('/')
      }
    })
  },
  methods: {
    signinWithGoogle() {
      auth
        .signInWithPopup(provider)
        .then((response) => {
          this.$store.dispatch('updateUser', {
            uid: response.user.uid
          })
          this.$router.push('/')
        })
        .catch((error) => {
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables';
.signin {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>
