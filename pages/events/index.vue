<template lang="pug">
section
  section-head(title='Events')
  list
    list-item(
      v-for='event in events'
      :key='event.id')
      template(#body)
        .eventItem(@click='goto(event)')
          time.eventItem__child(
            :datetime='event.dateMeta')
            |{{ event.dateText }}
          .eventItem__child.eventItem__child--main {{ event.name }}
</template>

<script>
import list from '@/components/list'
import listItem from '@/components/listItem'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { firestore } from '~/plugins/firebase.js'
export default {
  components: { list, listItem, sectionHead },
  data() {
    return {
      events: []
    }
  },
  computed: {
    uid() {
      return this.$store.state.uid
    }
  },
  watch: {
    uid(uid) {
      if (uid) {
        this.fetchEvents()
      }
    }
  },
  mounted() {
    if (this.uid) this.fetchEvents()
  },
  methods: {
    fetchEvents() {
      firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            const event = new Event({ ...doc.data(), id: doc.id })
            this.events.push(event)
          })
        })
        .catch((error) => {
          throw error
        })
    },
    goto(item) {
      this.$router.push({
        name: 'eventId-list',
        params: {
          eventId: item.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.eventItem {
  display: flex;
  margin: -10px;

  &__child {
    min-width: 150px;
    padding: 10px;

    &--main {
      font-weight: bold;
      flex-grow: 1;
    }
  }
}
</style>
