<template lang="pug">
section
  template(v-if='event')
    section-head(
      :title='event.name'
      :sub-title='event.dateText')
      template(
        #content
        v-if='event.text') {{ event.text }}
    section-content
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
        sectionButton
          g-button(
            @click='create'
            type='primary') Submit
  loading(v-else)

</template>

<script>
import gButton from '@/components/button'
import loading from '@/components/loading'
import sectionButton from '@/components/sectionButton'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const GUEST_TYPES = ['Player', 'Listener']
const INSTRUMENTS = ['Guitar', 'Keyboard', 'Bass', 'Drums', 'Other']
export default {
  components: { gButton, loading, sectionButton, sectionContent, sectionHead },
  data() {
    return {
      event: null,
      name: '',
      instruments: [],
      instrumentMain: '',
      instrumentOther: '',
      type: GUEST_TYPES[0]
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
    },
    uid() {
      return this.$store.state.uid
    }
  },
  watch: {
    instruments(values) {
      if (values.length <= 1 || !values.includes(this.instrumentMain))
        this.instrumentMain = ''
    },
    uid(uid) {
      if (uid) this.init()
    }
  },
  mounted() {
    if (this.uid) this.init()
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
      this.eventDoc
        .collection('guests')
        .doc()
        .set({ ...guest })
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
    init() {
      this.eventDoc = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.$route.params.eventId)
      this.eventDoc
        .get()
        .then((doc) => {
          if (!doc.exists) throw new Error('Event not found')
          this.event = new Event(doc.data())
        })
        .catch((error) => {
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  margin-bottom: 20px;
}
</style>
