<template lang="pug">
section
  section-head-event
    a(@click='$router.push({name:"eventId-enter"})')
      | Enter page
</template>

<script>
import sectionHeadEvent from '@/components/sectionHeadEvent'
import { firestore } from '~/plugins/firebase.js'
export default {
  components: { sectionHeadEvent },
  data() {
    return {
      guests: []
    }
  },
  computed: {
    uid() {
      return this.$store.state.uid
    }
  },
  watch: {
    uid(uid) {
      if (uid) this.fetchGuests()
    }
  },
  mounted() {
    if (this.uid) this.fetchGuests()
  },
  methods: {
    fetchGuests() {
      firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.$route.params.eventId)
        .collection('guests')
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            this.guests.push({ ...doc.data(), id: doc.id })
          })
        })
        .catch((error) => {
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  transition: transform 0.3s;
  &.isOpen {
    transform: rotate(180deg);
  }
}
.information {
  margin: 10px 0;
}
</style>
