<template lang="pug">
section
  section-head(
    :title='event.name'
    :sub-title='event.dateText')
    h1.event__name {{ event.name }}
    template(#functions)
      i.icon.el-icon-arrow-down(
        :class='{isOpen: showInfo}'
        @click='showInfo = !showInfo')
    template(#content)
      ul.information(v-show='showInfo')
        li(v-if='timeText') {{ timeText }}
        li(v-if='event.charge') Charge: {{ event.charge }}
        li(v-if='hostText') Hosts: {{ hostText }}
        li(v-if='event.description') {{ event.description }}
      a(@click='$router.push({name:"eventId-enter"})')
        | Enter page
</template>

<script>
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { firestore } from '~/plugins/firebase.js'
export default {
  components: { sectionHead },
  data() {
    return {
      event: {},
      guests: [],
      showInfo: false
    }
  },
  computed: {
    hostText() {
      return (this.event.hostTexts || []).join(', ')
    },
    timeText() {
      const openAt = this.event.openAt ? `Open ${this.event.openAtText}` : null
      const startAt = this.event.startAt
        ? `Start ${this.event.startAtText}`
        : null
      return [openAt, startAt].filter((v) => v).join(' / ')
    },
    uid() {
      return this.$store.state.uid
    }
  },
  watch: {
    uid(uid) {
      if (uid) this.init()
    }
  },
  mounted() {
    if (this.uid) this.init()
  },
  methods: {
    init() {
      this.eventDoc = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.$route.params.eventId)

      this.fetchEvent()
      this.fetchGuests()
    },
    fetchEvent() {
      this.eventDoc
        .get()
        .then((doc) => {
          this.event = new Event(doc.data())
        })
        .catch((error) => {
          throw error
        })
    },
    fetchGuests() {
      this.eventDoc
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
