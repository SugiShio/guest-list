<template lang="pug">
section
  section-head-event
    a(@click='$router.push({name:"eventId-enter"})')
      | Enter page
  section-content
    ul.table
      li.table__item(v-for='block in guestsCategorised')
        h1.table__title {{ block.instrument }}
        ul
          li.guest(
            v-for='guest in block.guests'
            :class='{isSub: guest.isSub, isSelected: guest.isSelected}'
            @click='updateGuestsSelected(guest)')
            div
              |{{ guest.name }}
              span(v-if='block.instrument === "Other"')
                |({{ guest.instrumentOther }})
            div(v-if='guest.count') {{ guest.count }}
  .buttonNewSession(
    v-if='guestsSelected.length'
    @click='openModalNewSession')
    |Create a new session
</template>

<script>
import sectionContent from '@/components/sectionContent'
import sectionHeadEvent from '@/components/sectionHeadEvent'
import { Guest } from '@/models/guest'
import { firestore } from '~/plugins/firebase.js'
const INSTRUMENTS = ['Guitar', 'Keyboard', 'Bass', 'Drums', 'Other']
export default {
  components: { sectionContent, sectionHeadEvent },
  data() {
    return {
      guests: [],
      guestsSelected: []
    }
  },
  computed: {
    guestsCategorised() {
      return INSTRUMENTS.map((instrument) => {
        const guests = this.guests
          .filter((guest) => guest.instruments.includes(instrument))
          .map((guest) => {
            return {
              ...guest,
              isSub: guest.instrumentMain !== instrument,
              isSelected: this.guestsSelected.includes(guest.id)
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
      if (uid) this.fetchGuests()
    }
  },
  mounted() {
    if (this.uid) this.fetchGuests()
  },
  methods: {
    fetchGuests() {
      firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc(this.$route.params.eventId)
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
    openModalNewSession() {},
    updateGuestsSelected(guest) {
      if (this.guestsSelected.includes(guest.id)) {
        const index = this.guestsSelected.findIndex((g) => g === guest.id)
        this.guestsSelected.splice(index, 1)
      } else {
        this.guestsSelected.push(guest.id)
      }
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
    color: #e50012;
    margin: 10px 0;
  }
}
.guest {
  display: flex;
  justify-content: space-between;
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
