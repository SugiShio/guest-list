<template lang="pug">
div
  loading(v-if='isLoading')
  template(v-show='!isLoading')
    header.header
      .header__inner
        a.backButton(
          v-if='hasHistory'
          @click='back')
          i.el-icon-arrow-left
        g-menu(
          v-if='isSignin'
          @signout='signout')
    div.wrapper
      nuxt
</template>

<script>
import gMenu from '@/components/menu'
import loading from '@/components/loading'
import { auth } from '~/plugins/firebase.js'
export default {
  components: { gMenu, loading },
  computed: {
    hasHistory() {
      return history.length > 1
    },
    isLoading() {
      return this.$store.state.isLoading
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
      history.back()
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
