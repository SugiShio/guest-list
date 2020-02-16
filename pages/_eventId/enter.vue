<template lang="pug">
section
  section-head-event
  section-content
    .text(v-if='event.text') {{ event.text }}
    el-form
      el-form-item
        el-input(
          v-model='name'
          placeholder='Name')
      el-form-item
        el-radio-group(v-model='type')
          el-radio(
            v-for='type in guestTypes'
            :label='type'
            :key='type')
      template(v-if='type === "Player"')
        el-form-item
          el-checkbox-group(
            v-model='instruments')
            el-checkbox(
              v-for='instrument in instrumentsCanditate'
              :label='instrument'
              :key='instrument')
        el-form-item(v-if='instruments.includes("Other")')
          el-input(
            v-model='instrumentOther'
            placeholder='Input instrument(s)')
        el-form-item(v-if='instruments.length > 1')
          el-select(
            v-model='instrumentMain'
            placeholder='Select your main instrument')
            el-option(
              v-for='instrument in instrumentsOrdered'
              :label='instrument'
              :key='instrument'
              :value='instrument')
      el-form-item
        el-button(@click='create') Submit

</template>

<script>
import sectionContent from '@/components/sectionContent'
import sectionHeadEvent from '@/components/sectionHeadEvent'
import { Event } from '@/models/event'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const GUEST_TYPES = ['Player', 'Listener']
const INSTRUMENTS = ['Guitar', 'Keyboard', 'Bass', 'Drums', 'Other']
export default {
  components: { sectionContent, sectionHeadEvent },
  data() {
    return {
      event: new Event(),
      name: '',
      instruments: [],
      instrumentMain: '',
      instrumentOther: '',
      type: GUEST_TYPES[0],
      isWide: true
    }
  },
  computed: {
    guestTypes() {
      return GUEST_TYPES
    },
    instrumentsCanditate() {
      return INSTRUMENTS
    },
    instrumentsOrdered() {
      return INSTRUMENTS.filter((instrument) =>
        this.instruments.includes(instrument)
      )
    }
  },
  watch: {
    instruments(values) {
      if (values.length <= 1 || !values.includes(this.instrumentMain))
        this.instrumentMain = ''
    }
  },
  mounted() {
    this.setIsWide()
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.setIsWide()
      }, 300)
    })
  },
  methods: {
    create() {
      const guest = new Guest({
        name: this.name,
        type: this.type,
        instruments: this.instrumentsOrdered,
        instrumentMain: this.instrumentMain,
        instrumentOther: this.instrumentOther,
        createdAt: new Date().getTime()
      })
      firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.$route.params.eventId)
        .collection('guests')
        .doc()
        .set(guest.toObject())
        .then((responce) => {
          this.name = ''
          this.instruments = []
          this.instrumentMain = ''
          this.instrumentOther = ''
          this.type = GUEST_TYPES[0]
        })
        .catch((error) => {
          throw error
        })
    },
    setIsWide() {
      this.isWide = window.innerWidth > 600
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  margin-bottom: 20px;
}
</style>
