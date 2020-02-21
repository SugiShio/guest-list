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
      el-form(
        :model='guest'
        :rules='rules'
        ref='form')
        el-form-item(prop='name')
          el-input(
            v-model='guest.name'
            placeholder='Name')
        el-form-item(prop='type')
          el-radio-group(v-model='guest.type')
            el-radio(
              v-for='type in guestTypes'
              :label='type'
              :key='type')
        template(v-if='guest.type === "Player"')
          el-form-item(prop='instruments')
            el-checkbox-group(
              v-model='guest.instruments')
              el-checkbox(
                v-for='instrument in instrumentsCanditate'
                :label='instrument'
                :key='instrument')
          el-form-item(
            v-if='guest.instruments.includes("Other")'
            prop='instrumentOther')
            el-input(
              v-model='guest.instrumentOther'
              placeholder='Input instrument(s)')
          el-form-item(
            v-if='guest.instruments.length > 1'
            prop='instrumentMain')
            el-select(
              v-model='guest.instrumentMain'
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
import { GUEST_TYPES, INSTRUMENTS } from '@/constants'
import { Event } from '@/models/event'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const guestTypes = Object.values(GUEST_TYPES)
const instrumentsCanditate = Object.values(INSTRUMENTS)
export default {
  components: { gButton, loading, sectionButton, sectionContent, sectionHead },
  data() {
    return {
      guest: {
        name: '',
        instruments: [],
        instrumentMain: '',
        instrumentOther: '',
        type: guestTypes[0]
      },
      event: null,
      rules: {
        name: {
          validator: (rule, value, callback) => {
            const result = Guest.validate(this.guest).name
            callback(result)
          },
          trigger: 'blur'
        },
        instruments: {
          validator: (rule, value, callback) => {
            const result = Guest.validate(this.guest).instruments
            callback(result)
          },
          trigger: 'blur'
        },
        instrumentMain: {
          validator: (rule, value, callback) => {
            const result = Guest.validate(this.guest).instrumentMain
            callback(result)
          },
          trigger: 'blur'
        },
        instrumentOther: {
          validator: (rule, value, callback) => {
            const result = Guest.validate(this.guest).instrumentOther
            callback(result)
          },
          trigger: 'blur'
        }
      }
    }
  },
  computed: {
    guestTypes() {
      return guestTypes
    },
    instrumentsCanditate() {
      return instrumentsCanditate
    },
    instrumentsOrdered() {
      return instrumentsCanditate.filter((instrument) =>
        this.guest.instruments.includes(instrument)
      )
    },
    uid() {
      return this.$store.state.uid
    }
  },
  watch: {
    'guest.instruments'(values) {
      if (values.length <= 1 || !values.includes(this.guest.instrumentMain))
        this.guest.instrumentMain = null
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
      let isValid = false
      this.$refs.form.validate((valid) => {
        isValid = valid
      })
      if (!isValid) return

      const guest = {
        ...this.guest,
        instruments: this.instrumentsOrdered,
        createdAt: new Date().getTime()
      }
      this.eventDoc
        .collection('guests')
        .doc()
        .set({ ...new Guest(guest) })
        .then((responce) => {
          this.guest.name = ''
          this.guest.instruments = []
          this.guest.instrumentMain = ''
          this.guest.instrumentOther = ''
          this.guest.type = guestTypes[0]
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

<style lang="scss" scoped></style>
