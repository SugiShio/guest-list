<template lang="pug">
section
  section-head-event
    g-button(
      @click='$router.push({name:"events-eventId"})'
      size='mini'
      type='weak'
      inline) Event page
    g-button(
      @click='$router.push({name:"eventId-enter"})'
      size='mini'
      type='weak'
      inline) Enter page
  section-content
    ul.table
      li.table__item(v-for='block in guestsCategorised')
        h1.table__title {{ block.instrument }}
        ul
          li.guest(
            v-for='guest in block.guests'
            :class='{isSub: guest.isSub, isSelected: guest.isSelected}'
            @click='updateGuestsSelected(guest.item)')
            div
              template(v-if='block.instrument === "Other"') {{ guest.item.guestText }}
              template(v-else) {{ guest.item.name }}
            div(v-if='guest.item.count') {{ guest.item.count }}
  .buttonNewSession(
    v-if='guestsSelected.length'
    @click='showModalNewSession = true')
    |Create a new session
  modal(
    v-if='showModalNewSession'
    @cancel='showModalNewSession = false')
    section-head(title='New session')
      template(#functions)
        g-button(
          @click='showModalNewSession = false'
          type='weak'
          inline) Close
    section-content
      el-form(label-position='top')
        el-form-item(label='Members')
          ul
            li(v-for='guest in guestsSelected') {{ guest.guestText }}
        el-form-item(label='What song will you play?')
          el-input(v-model='song')
        section-button
          g-button(
            @click='showModalNewSession = false'
            type='weak') Cancel
          g-button(
            @click='createSession'
            type='primary') Start!

</template>

<script>
import gButton from '@/components/button'
import modal from '@/components/modal'
import sectionButton from '@/components/sectionButton'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import sectionHeadEvent from '@/components/sectionHeadEvent'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const INSTRUMENTS = ['Guitar', 'Keyboard', 'Bass', 'Drums', 'Other']
export default {
  components: {
    gButton,
    modal,
    sectionButton,
    sectionContent,
    sectionHead,
    sectionHeadEvent
  },
  data() {
    return {
      guests: [],
      guestsSelected: [],
      showModalNewSession: false,
      song: ''
    }
  },
  computed: {
    guestsCategorised() {
      return INSTRUMENTS.map((instrument) => {
        const guests = this.guests
          .filter((guest) => guest.instruments.includes(instrument))
          .map((guest) => {
            const isSelected = !!this.guestsSelected.find(
              (guestSelected) => guestSelected.id === guest.id
            )
            const isSub = guest.instrumentMain !== instrument
            return {
              item: guest,
              isSub,
              isSelected
            }
          })
        return { instrument, guests }
      })
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
      this.fetchGuests()
    },
    fetchGuests() {
      this.eventDoc
        .collection('guests')
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            this.guests.push(new Guest({ ...doc.data(), id: doc.id }))
          })
        })
        .catch((error) => {
          throw error
        })
    },
    updateGuestsSelected(guest) {
      const index = this.guestsSelected.findIndex(
        (guestSelected) => guestSelected.id === guest.id
      )
      if (index < 0) {
        this.guestsSelected.push(guest)
      } else {
        this.guestsSelected.splice(index, 1)
      }
    },
    createSession() {
      const history = {
        song: this.song,
        guests: this.guestsSelected.map((guest) => guest.name),
        createdAt: new Date().getTime()
      }
      this.guestsSelected.forEach((guest) => {
        this.eventDoc
          .collection('guests')
          .doc(guest.id)
          .update({ count: guest.count + 1 })
          .then((responce) => {})
          .catch((error) => {
            throw error
          })
      })
      this.eventDoc
        .collection('history')
        .doc()
        .set(history)
        .then((responce) => {
          this.showModalNewSession = false
          this.guestsSelected = []
          this.song = ''
          this.guests = []
          this.fetchGuests()
        })
        .catch((error) => {
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  display: flex;
  margin: -5px -5px 50px;
  &__item {
    width: 100%;
    padding: 5px;
  }
  &__title {
    text-align: center;
    border-bottom: 2px solid #e50012;
    padding: 5px;
    margin: 10px 0;
  }
}
.guest {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  cursor: pointer;
  padding: 5px 10px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #eee;
  }
  &.isSub {
    opacity: 0.6;
  }
  &.isSelected {
    background-color: #e50012;
    > div {
      color: #fff;
      font-weight: bold;
    }
  }
  & + & {
    margin-top: 5px;
  }
}
.buttonNewSession {
  position: fixed;
  right: 20px;
  bottom: 15px;
  left: 20px;
  padding: 10px;
  background-color: #e50012;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  transition: opacity 0.3s;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
}
</style>
