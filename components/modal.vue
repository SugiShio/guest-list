<template lang="pug">
div
  transition(name='fade')
    .modalWrapper(
      @click='$emit("cancel")'
      v-show='isShow')
      .modal(@click.stop)
        section-head(
          :title='title'
          :sub-title='subTitle')
          template(#functions)
            g-button(
              @click='$emit("cancel")'
              type='weak'
              inline) Close
        section-content
          slot(name='content')

</template>

<script>
import gButton from '@/components/button'
import sectionHead from '@/components/sectionHead'
import sectionContent from '@/components/sectionContent'
export default {
  components: {
    gButton,
    sectionContent,
    sectionHead
  },
  props: {
    isShow: { type: Boolean, default: false },
    title: { type: String, default: '' },
    subTitle: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.modalWrapper {
  @extend %fade;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(#fff, 0.8);
  z-index: $z-index-modal;
}

.modal {
  width: calc(100% - 40px);
  max-height: calc(100vh - 40px);
  max-width: $width-wrapper;
  padding-bottom: 20px;
  overflow: scroll;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(#000, 0.1);
}
</style>
