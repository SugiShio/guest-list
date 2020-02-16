<template lang="pug">
.sectionButton
  slot
</template>

<style lang="scss" scoped>
.sectionButton {
  display: flex;
  justify-content: center;
  padding: 0 20px;

  /deep/ .button {
    margin: 0 10px;
  }
}
</style>
