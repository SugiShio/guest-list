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
        template(v-if='guest.isPlayer')
          el-form-item(prop='instruments')
            el-checkbox-group(
              v-model='guest.instruments')
              el-checkbox(
                v-for='instrument in instrumentsCanditate'
                :label='instrument'
                :key='instrument')
          el-form-item(
            v-if='guest.hasInstrumentOther'
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

</template>

<script>
import gButton from '@/components/button'
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
  components: { gButton, sectionButton, sectionContent, sectionHead },
  data() {
    const validators = {}
    const keys = ['name', 'instruments', 'instrumentMain', 'instrumentOther']
    keys.forEach((key) => {
      validators[key] = {
        validator: (rule, value, callback) => {
          callback(Guest.validate[key](this.guest))
        },
        trigger: 'none'
      }
    })
    return {
      guest: new Guest(),
      event: null,
      rules: validators
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
  created() {
    this.$store.commit('setLoading')
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
          this.guest = new Guest()
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
          this.$store.commit('setLoaded')
        })
        .catch((error) => {
          this.$store.commit('setLoadedWithError', { error })
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
