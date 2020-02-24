<template lang="pug">
g-button(
  @click='signinWithGoogle'
  inline) {{ $t('signinWithGoogle') }}
</template>

<script>
import gButton from '@/components/button'
import firebase, { auth } from '~/plugins/firebase.js'
const provider = new firebase.auth.GoogleAuthProvider()

export default {
  components: { gButton },
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
