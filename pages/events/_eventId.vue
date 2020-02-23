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
        :disabled='isPosting'
        @cancel='isEdit = false'
        @submit='update')
  loading(v-else)
</template>

<script>
import formEvent from '@/components/formEvent'
import gButton from '@/components/button'
import loading from '@/components/loading'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { firestore } from '~/plugins/firebase.js'

export default {
  components: { formEvent, gButton, loading, sectionContent, sectionHead },
  data() {
    return {
      event: null,
      eventId: this.$route.params.eventId,
      isEdit: false,
      isPosting: false
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
    this.$store.commit('resetError')
    if (this.uid) this.init()
  },
  methods: {
    init() {
      this.eventDoc = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.eventId)
      this.$store.commit('resetError')
      this.fetchEvent().catch((error) => {
        this.$store.commit('setError', { error })
        throw error
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
      this.isPosting = true
      event = new Event({
        ...event,
        updatedAt: new Date().getTime()
      })
      this.eventDoc
        .update({ ...event })
        .then((responce) => {
          this.fetchEvent()
        })
        .then(() => {
          this.isEdit = false
          this.isPosting = false
        })
        .catch((error) => {
          this.isPosting = false
          this.$store.commit('setError', { error })
          throw error
        })
    }
  }
}
</script>
<style></style>
