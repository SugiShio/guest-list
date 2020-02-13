<template lang="pug">
  div
    ul
      li(v-for='item in items')
        | {{ item }}
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
      const collection = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
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
