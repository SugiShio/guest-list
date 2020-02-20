<template lang="pug">
section
  section-head(title='Events')
    template(#functions)
      g-button(
        @click='$router.push({name:"events-new"})'
        type='weak')
          i.el-icon-plus
          | &nbsp;New Event
  list(v-if='events.length')
    list-item(
      v-for='event in events'
      :key='event.id'
      :actions='actions(event)')
      template(#body)
        .eventItem(@click='goto(event)')
          time.eventItem__child(
            :datetime='event.dateMeta')
            |{{ event.dateText }}
          .eventItem__child.eventItem__child--main {{ event.name }}
</template>

<script>
import gButton from '@/components/button'
import list from '@/components/list'
import listItem from '@/components/listItem'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { firestore } from '~/plugins/firebase.js'
export default {
  components: { gButton, list, listItem, sectionHead },
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
        this.init()
      }
    }
  },
  mounted() {
    if (this.uid) this.init()
  },
  methods: {
    actions(event) {
      return [
        {
          label: 'Detail',
          action: () => {
            this.$router.push({
              name: 'events-eventId',
              params: { eventId: event.id }
            })
          }
        },
        {
          label: 'Delete',
          color: 'red',
          action: () => {
            if (!confirm(`Are you sure to delete an event "${event.name}" ?`))
              return
            this.eventCollection
              .doc(event.id)
              .delete()
              .then(() => {
                this.fetchEvents()
              })
              .catch((error) => {
                throw error
              })
          }
        }
      ]
    },
    fetchEvents() {
      this.eventCollection
        .orderBy('openAt', 'desc')
        .get()
        .then((querySnapShot) => {
          this.events = []
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
    },
    init() {
      this.eventCollection = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
      this.fetchEvents()
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
