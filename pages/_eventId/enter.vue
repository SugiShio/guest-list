<template lang="pug">
  div
    |A page to enter informations of a guest
    el-form(label-width='100px')
      el-form-item(label='Name')
        el-input(v-model='name')
      el-form-item(label='Part')
        el-input(v-model='part')
      el-form-item()
        el-button(@click='create') Submit

</template>

<script>
import { firestore } from '~/plugins/firebase.js'
export default {
  data() {
    return {
      name: '',
      part: ''
    }
  },
  methods: {
    create() {
      const eventId = this.$route.params.eventId
      this.isPosting = true
      const data = {
        name: this.name,
        createdAt: new Date().getTime()
      }
      return firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(eventId)
        .collection('guests')
        .doc()
        .set(data)
        .then((responce) => {
          console.log(responce)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style></style>
