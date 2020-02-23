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
            :placeholder='$t("name")')
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
              :placeholder='$t("eventId-enter.inputInstrument")')
          el-form-item(
            v-if='guest.instruments.length > 1'
            prop='instrumentMain')
            el-select(
              v-model='guest.instrumentMain'
              :placeholder='$t("eventId-enter.selectInstrument")')
              el-option(
                v-for='instrument in instrumentsOrdered'
                :label='instrument'
                :key='instrument'
                :value='instrument')
        sectionButton
          g-button(
            @click='create'
            :disabled='isPosting'
            type='primary') {{ $t("submit") }}
    modal(
      :isShow='showModal'
      title='Thank you !'
      @cancel='showModal = false')
      template(#content)
        p {{ thankyouText }}
  loading(v-else)

</template>

<script>
import gButton from '@/components/button'
import loading from '@/components/loading'
import modal from '@/components/modal'
import sectionButton from '@/components/sectionButton'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { GUEST_TYPES, INSTRUMENTS } from '@/constants'
import { Event } from '@/models/event'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const guestTypes = Object.values(GUEST_TYPES)
const instrumentsCanditate = Object.values(INSTRUMENTS)
const THANKYOU_TEXTS = [
  'Please enjoy yourselves!',
  'Have fabulous time with us !',
  'Have fun!',
  'Have a great time!'
]
export default {
  layout: 'public',
  components: {
    gButton,
    loading,
    modal,
    sectionButton,
    sectionContent,
    sectionHead
  },
  data() {
    const validators = {}
    const keys = ['name', 'instruments', 'instrumentMain', 'instrumentOther']
    keys.forEach((key) => {
      validators[key] = {
        validator: (rule, value, callback) => {
          const error = Guest.validate[key](this.guest)
          if (error) callback(this.$t(`errorMessages.${error}`))
          else callback()
        },
        trigger: 'none'
      }
    })
    return {
      guest: new Guest(),
      event: null,
      isPosting: false,
      thankyouText: '',
      rules: validators,
      showModal: false
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
    if (this.uid) this.init()
  },
  methods: {
    create() {
      let isValid = false
      this.$refs.form.validate((valid) => {
        isValid = valid
      })
      if (!isValid) return

      this.isPosting = true
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
          const randamIndex = Math.floor(Math.random() * THANKYOU_TEXTS.length)
          this.thankyouText =
            this.event.thankyouText || THANKYOU_TEXTS[randamIndex]
          this.guest = new Guest()
          this.isPosting = false
          this.showModal = true
          setTimeout(() => {
            this.showModal = false
          }, 10000)
        })
        .catch((error) => {
          this.isPosting = false
          throw error
        })
    },
    init() {
      this.eventDoc = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.$route.params.eventId)
      this.$store.commit('resetError')
      this.eventDoc
        .get()
        .then((doc) => {
          if (!doc.exists) throw new Error('Event not found')
          this.event = new Event(doc.data())
        })
        .catch((error) => {
          this.$store.commit('setError', { error })
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
