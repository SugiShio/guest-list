<template lang="pug">
div
  a(
    @click='signinWithGoogle'
  ) Sign in with Google
</template>

<script>
import firebase, { auth } from '~/plugins/firebase.js'
const provider = new firebase.auth.GoogleAuthProvider()

export default {
  created() {
    if (this.$store.state.isSignin) {
      this.$router.push('/')
    }
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
          console.error(error)
        })
    }
  }
}
</script>
