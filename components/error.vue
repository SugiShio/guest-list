<template lang="pug">
.error
  h2.error__title Error
  p.error__message {{ error.message }}
  .error__buttons
    g-button(
      @click='back'
      size='mini'
      type='weak'
      inline) Go back
</template>

<script>
import gButton from '@/components/button'
export default {
  components: { gButton },
  computed: {
    error() {
      return this.$store.state.error
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables';
.error {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  &__title,
  &__message,
  &__buttons {
    text-align: center;
    margin: 10px 0;
  }
  &__title {
    font-size: 40px;
  }
  &__buttons {
    margin: 50px 0;
  }
}
</style>
