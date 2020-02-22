<template lang="pug">
div
  error(v-if='hasError')
  header.header
    .header__inner(v-if='isSignin')
      a.backButton(@click='back')
        i.el-icon-arrow-left
      g-menu(@signout='signout')
  main.wrapper(v-show='!hasError')
    nuxt
</template>

<script>
import error from '@/components/error'
import gMenu from '@/components/menu'
import { auth } from '~/plugins/firebase.js'
export default {
  components: { error, gMenu },
  computed: {
    hasError() {
      return !!this.$store.state.error
    },
    isSignin() {
      return this.$store.state.isSignin
    }
  },
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
    back() {
      this.$router.go(-1)
    },
    signout() {
      auth.signOut().then(() => {
        this.$store.dispatch('signout')
        this.$router.push({ name: 'signin' })
      })
    }
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

.header {
  height: 50px;
  &__inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: $width-wrapper;
    margin: auto;
  }
}
.backButton {
  @extend %hoverOpacity;
  width: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
}
</style>
