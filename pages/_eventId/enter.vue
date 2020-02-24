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
                :label='instrument.value'
                :key='instrument.value') {{ instrument.label }}
              el-form-item.inputOther(prop='instrumentOther')
                el-input(
                  :disabled='!guest.hasInstrumentOther'
                  prop='instrumentOther'
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
                :label='instrument.label'
                :key='instrument.value'
                :value='instrument.value')
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
import { GUEST_TYPES, VALUE_OTHER } from '@/constants'
import { Event } from '@/models/event'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const guestTypes = Object.values(GUEST_TYPES)
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
    const keys = Object.keys(Guest.validate)
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
      const instruments = this.event.instruments.map((instrument) => {
        return { label: instrument, value: instrument }
      })
      return [...instruments, { label: this.$t('other'), value: VALUE_OTHER }]
    },
    instrumentsOrdered() {
      return this.instrumentsCanditate.filter((instrument) =>
        this.guest.instruments.includes(instrument.value)
      )
    },
    thankyouTexts() {
      return this.$t('eventId-enter.thankyouTexts')
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
      const instruments = this.instrumentsOrdered.map(
        (instrument) => instrument.value
      )
      const guest = {
        ...this.guest,
        instruments,
        createdAt: new Date().getTime()
      }
      this.eventDoc
        .collection('guests')
        .doc()
        .set({ ...new Guest(guest) })
        .then((responce) => {
          const randamIndex = Math.floor(
            Math.random() * this.thankyouTexts.length
          )
          this.thankyouText =
            this.event.thankyouText || this.thankyouTexts[randamIndex]
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

<style lang="scss" scoped>
.inputOther {
  display: inline-block;
  margin-left: 10px;
}
</style>
