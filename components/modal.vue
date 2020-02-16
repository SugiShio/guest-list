<template lang="pug">
.modalWrapper(@click='$emit("cancel")')
  .modal(@click.stop)
    slot
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    subTitle: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.modalWrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(#fff, 0.8);
}

.modal {
  width: calc(100% - 40px);
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(#000, 0.1);
}
</style>
