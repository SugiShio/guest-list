<template lang="pug">
section
  template(v-if='event')
    section-head(
      v-if='!isEdit'
      :title='event.name')
      template(#functions)
        g-button(
          @click='$router.push({name:"eventId-list"})'
          size='mini'
          inline) Guest list
        g-button(
          @click='isEdit = true'
          size='mini'
          inline) Edit

    section-content
      form-event(
        :is-edit='isEdit'
        :event='event'
        @cancel='isEdit = false'
        @submit='update')

</template>

<script>
import formEvent from '@/components/formEvent'
import gButton from '@/components/button'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { firestore } from '~/plugins/firebase.js'

export default {
  components: { formEvent, gButton, sectionContent, sectionHead },
  data() {
    return {
      event: null,
      eventId: this.$route.params.eventId,
      isEdit: false
    }
  },
  computed: {
    uid() {
      return this.$store.state.uid
    }
  },
  watch: {
    uid(uid) {
      if (uid) this.init()
    }
  },
  created() {
    this.$store.commit('setLoading')
    if (this.uid) this.init()
  },
  methods: {
    init() {
      this.eventDoc = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.eventId)
      this.fetchEvent().then(() => {
        this.$store.commit('setLoaded')
      })
    },
    fetchEvent() {
      return this.eventDoc
        .get()
        .then((doc) => {
          if (!doc.exists) throw new Error('Event not found')
          this.event = new Event(doc.data())
        })
        .catch((error) => {
          throw error
        })
    },
    update(event) {
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
        createdAt: event.createdAt,
        updatedAt: new Date().getTime()
      })
      this.eventDoc
        .update({ ...event })
        .then((responce) => {
          this.fetchEvent()
          this.isEdit = false
        })
        .catch((error) => {
          throw error
        })
    }
  }
}
</script>
<style></style>
