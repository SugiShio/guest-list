<template lang="pug">
.inputTags
  el-tag(
    v-for='item in items'
    :closable='closable'
    :disable-transitions="false"
    :key='item'
    type='info'
    @close="handleClose(item)") {{ item }}
  el-input.inputTags__input(
    v-if='inputVisible'
    v-model='inputValue'
    ref='saveTagInput'
    :placeholder='placeholder'
    @keyup.enter.native="handleInputConfirm"
    @blur="handleInputConfirm")
  el-button.inputTags__button(
    v-else
    @click='showInput')
    i.el-icon-plus
    | &nbsp;{{ buttonText }}

</template>

<script>
import { VALUE_OTHER } from '@/constants'
export default {
  props: {
    items: { type: Array, default: () => [] },
    buttonText: { type: String, default: '' },
    placeholder: { type: String, default: '' }
  },
  data() {
    return {
      inputValue: '',
      inputVisible: false
    }
  },
  computed: {
    closable() {
      return this.items.length > 1
    }
  },
  methods: {
    handleClose(item) {
      this.items.splice(this.items.indexOf(item), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      const index = this.items.includes(VALUE_OTHER)
        ? this.items.indexOf(VALUE_OTHER)
        : this.items.length
      if (inputValue) {
        this.items.splice(index, 0, inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.inputTags {
  .el-tag {
    margin-right: 10px;
  }
  &__button {
    padding: 0 10px !important;
    line-height: 30px !important;
    font-size: 12px !important;
  }
  &__input {
    width: auto !important;
    /deep/input {
      line-height: 30px !important;
      height: 32px !important;
    }
  }
}
</style>
