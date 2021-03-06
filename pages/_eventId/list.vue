<template lang="pug">
section
  template(v-if='isLoaded')
    section-head(
      :title='event.name'
      :sub-title='event.dateText')
      template(#functions)
        g-button(
          @click='$router.push({name:"events-eventId"})'
          size='mini'
          inline) Detail
        g-button(
          @click='$router.push({name:"eventId-enter"})'
          size='mini'
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
                | {{ guest.item.name }}
                template(v-if='block.instrument === "Other"')
                  | &nbsp;({{ guest.item.instrumentOther }})
              div(v-if='guest.item.count') {{ guest.item.count }}
    .buttonNewSession(
      v-if='guestsSelected.length'
      @click='showModalNewSession = true')
      |Create a new session
    modal(
      :isShow='showModalNewSession'
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
              :disabled='isPostingNewSession'
              @click='createSession'
              type='primary') Start!
  loading(v-else)

</template>

<script>
import gButton from '@/components/button'
import loading from '@/components/loading'
import modal from '@/components/modal'
import sectionButton from '@/components/sectionButton'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { INSTRUMENTS } from '@/constants'
import { Event } from '@/models/event'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const instruments = Object.values(INSTRUMENTS)
export default {
  components: {
    gButton,
    loading,
    modal,
    sectionButton,
    sectionContent,
    sectionHead
  },
  data() {
    return {
      event: null,
      guests: [],
      guestsSelected: [],
      isLoaded: false,
      isPostingNewSession: false,
      showModalNewSession: false,
      song: ''
    }
  },
  computed: {
    guestsCategorised() {
      return instruments.map((instrument) => {
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
  created() {
    if (this.uid) this.init()
  },
  methods: {
    init() {
      this.eventDoc = firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.$route.params.eventId)
      this.$store.commit('resetError')
      Promise.all([this.fetchEvent(), this.fetchGuests()])
        .then(() => {
          this.isLoaded = true
        })
        .catch((error) => {
          this.isLoaded = true
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
    fetchGuests() {
      return this.eventDoc
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
      this.isPostingNewSession = true
      this.$store.commit('resetError')
      const history = {
        song: this.song,
        guests: this.guestsSelected.map((guest) => guest.name),
        createdAt: new Date().getTime()
      }
      this.createHistory(history)
        .then(() => {
          return Promise.all(
            this.guestsSelected.map((guest) => {
              this.updateGuestCount(guest).catch((error) => {
                throw error
              })
            })
          )
        })
        .then((values) => {
          this.guestsSelected = []
          this.song = ''
          this.guests = []
          this.fetchGuests()
        })
        .then(() => {
          this.isPostingNewSession = false
          this.showModalNewSession = false
        })
        .catch((error) => {
          this.isPostingNewSession = false
          this.showModalNewSession = false
          this.$store.commit('setError', { error }) // todo firebaseのエラーが拾えていないので直す
          throw error
        })
    },
    createHistory(history) {
      return this.eventDoc
        .collection('history')
        .doc()
        .set(history)
        .catch((error) => {
          throw error
        })
    },
    updateGuestCount(guest) {
      return this.eventDoc
        .collection('guests')
        .doc('guest.id')
        .update({ count: guest.count + 1 })
        .catch((error) => {
          throw error
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/stylesheets/utils';
.table {
  margin: -5px -5px 50px;
  @include screensize-lg {
    display: flex;
  }
  &__item {
    width: 100%;
    padding: 5px;
  }
  &__title {
    border-bottom: 2px solid $color-accent;
    padding: 5px;
    margin: 10px 0;
    @include screensize-lg {
      text-align: center;
    }
  }
}
.guest {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  cursor: pointer;
  padding: 5px 10px;
  transition: background-color $transition-default;
  &:hover {
    background-color: darken(#fff, 3%);
  }
  &.isSub {
    opacity: 0.6;
  }
  &.isSelected {
    background-color: $color-accent;
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
  @extend %hoverOpacity;
  position: fixed;
  right: 20px;
  bottom: 15px;
  left: 20px;
  padding: 10px;
  background-color: $color-accent;
  border-radius: 3px;
  text-align: center;
  color: #fff;
}
</style>
