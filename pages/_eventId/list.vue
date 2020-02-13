<template lang="pug">
  div
    ul
      li(v-for='item in items')
        | {{ item.name }}
</template>

<script>
import { firestore } from '~/plugins/firebase.js'
export default {
  data() {
    return {
      items: []
    }
  },
  computed: {
    uid() {
      return this.$store.state.uid
    }
  },
  mounted() {
    if (this.uid) this.fetchItems()
  },
  methods: {
    fetchItems() {
      const eventId = this.$route.params.eventId
      const collection = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(eventId)
        .collection('guests')
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            this.items.push({ ...doc.data(), id: doc.id })
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  watch: {
    uid(uid) {
      if (uid) {
        this.fetchItems()
      }
    }
  }
}
</script>
<style></style>
