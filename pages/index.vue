<template lang="pug">
section-content
  .index
    img.index__image(src='/logo.png')
    p.index__title {{ $t('index.hi') }}
    p.index__text {{ $t('index.text1')}}
    p.index__text {{ $t('index.text2')}}
    .index__buttons
      template(v-if='isSignin')
        g-button(
          @click='goto("events-new")'
          type='primary')
            i.el-icon-plus
            | &nbsp;{{ $t('newEvent') }}
        g-button(@click='goto("events")')
          | {{ $t('eventList') }}
      button-signin(v-else)
    .index__contact
      a(href='mailto:info@mimhhs.net') {{ $t('index.contact') }}
</template>

<script>
import ButtonSignin from '@/components/buttonSignin'
import gButton from '@/components/button'
import sectionContent from '@/components/sectionContent'
export default {
  layout: 'public',
  components: { ButtonSignin, gButton, sectionContent },
  computed: {
    isSignin() {
      return this.$store.state.isSignin
    }
  },
  methods: {
    goto(routeName) {
      this.$router.push({ name: `${routeName}___${this.$i18n.locale}` })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.index {
  padding: 50px 0;
  text-align: center;
  &__image {
    width: 250px;
    height: 250px;
  }
  &__title {
    font-size: 30px;
    margin: 30px 0;
  }
  &__text {
    margin: 10px 0;
  }
  &__buttons,
  &__contact {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    // flex-direction: column;
    /deep/.button + .button {
      margin-left: 20px;
    }
  }
  &__contact {
    margin-top: 50px;
    a {
      @extend %hoverOpacity;
      font-size: 13px;
    }
  }
}
</style>
