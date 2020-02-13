<template lang="pug">
  div
    h1 New Event
    el-form(label-width='15%')
      el-form-item(label="Event's Name")
        el-input(v-model='name')
      el-form-item(label='Date')
        el-date-picker(
          v-model='date'
          type='date'
          format='yyyy/M/d'
        )
        el-time-picker(
          v-model='startAt'
          placeholder='Start at'
          :picker-options='{format: "HH:mm"}')
        el-time-picker(
          v-model='endAt'
          placeholder='End at')
      el-form-item(label="Charge")
        el-input(v-model='charge')
      el-form-item(label="Hosts")
        el-input(v-model='hosts')
      el-form-item(label="Welcome text")
        el-input(
          v-model='text'
          type='textarea')
      el-form-item(label="Description")
        el-input(
          v-model='description'
          type='textarea')
      el-form-item()
        el-button(@click='create') Submit

</template>

<script>
import { firestore } from '~/plugins/firebase.js'
export default {
  data() {
    return {
      date: new Date(),
      name: '',
      startAt: '',
      endAt: '',
      hosts: '',
      text: '',
      charge: '',
      description: ''
    }
  },
  methods: {
    create() {
      const data = {
        name: this.name,
        startAt: new Date(this.startAt).getTime(),
        endAt: new Date(this.endAt).getTime(),
        hosts: this.hosts,
        text: this.text,
        charge: this.charge,
        description: this.description,
        date: new Date(this.date).getTime(),
        createdAt: new Date().getTime()
      }
      return firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc()
        .set(data)
        .then((responce) => {
          this.$router.push({ name: 'events' })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style></style>
