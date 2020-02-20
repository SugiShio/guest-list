<template lang="pug">
section
  section-head(title='New Event')
  section-content
    form-event(
      :is-edit='true'
      :event='event'
      @cancel='back'
      @submit='create')
</template>

<script>
import formEvent from '@/components/formEvent'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { firestore } from '~/plugins/firebase.js'
export default {
  components: { formEvent, sectionContent, sectionHead },
  data() {
    const openAt = new Date()
    openAt.setHours(openAt.getHours() + 1)
    openAt.setMinutes(0)
    openAt.setSeconds(0)
    const startAt = new Date()
    startAt.setHours(startAt.getHours() + 2)
    startAt.setMinutes(0)
    startAt.setSeconds(0)
    return {
      event: new Event({
        date: new Date(),
        openAt,
        startAt
      }),
      isWide: true
    }
  },
  methods: {
    back() {
      history.back()
    },
    create(event) {
      event = new Event({
        name: event.name,
        openAt: event.openAt,
        startAt: event.startAt,
        hosts: event.hosts,
        hostsInstruments: event.hostsInstruments,
        text: event.text,
        charge: event.charge,
        description: event.description,
        date: event.date,
        createdAt: new Date().getTime()
      })
      return firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc()
        .set({ ...event })
        .then((responce) => {
          this.$router.push({ name: 'events' })
        })
        .catch((error) => {
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
