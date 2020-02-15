<template lang="pug">
section
  section-head(title='New Event')
  section-content
    el-form(
      :label-position='labelPosition'
      label-width='120px')
      el-form-item(label="Event's Name")
        el-input(v-model='name')
      el-form-item(label='Date')
        el-row
          el-col(:span='sizeDate')
            el-date-picker(
              v-model='date'
              type='date'
              format='yyyy/M/d'
            )
          el-col(:span='sizeTime')
            el-time-picker(
              v-model='openAt'
              placeholder='Open at'
              :picker-options='{format: "HH:mm"}')
          el-col(:span='sizeTime')
            el-time-picker(
              v-model='startAt'
              placeholder='Start at'
              :picker-options='{format: "HH:mm"}')
      el-form-item(label="Charge")
        el-input(v-model='charge')
      el-form-item(label="Hosts")
        div.arrayForm(v-for='(host, index) in hosts')
          el-row.arrayForm__main
            el-col(:span='16')
              el-input(
                v-model='hosts[index]'
                placeholder='Name')
            el-col(:span='8')
              el-input(
                v-model='hostsInstruments[index]'
                placeholder='Instrument')
          .arrayForm__button(v-if='hosts.length>1')
            i.el-icon-circle-close(@click='removeHost(index)')
        el-row
          el-col(:span='24')
            el-button(size='small' @click='addHost')
              i.el-icon-plus
              |Add host
      el-form-item(label="Welcome text")
        el-input(
          v-model='text'
          type='textarea')
      el-form-item(label="Description")
        el-input(
          v-model='description'
          type='textarea')
      el-form-item()
        el-button(@click='create') Submit

</template>

<script>
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
import { firestore } from '~/plugins/firebase.js'
export default {
  components: { sectionContent, sectionHead },
  data() {
    const openAt = new Date()
    openAt.setHours(openAt.getHours() + 1)
    openAt.setMinutes(0)
    openAt.setSeconds(0)
    const startAt = new Date()
    startAt.setHours(startAt.getHours() + 2)
    startAt.setMinutes(0)
    startAt.setSeconds(0)
    return {
      date: new Date(),
      name: '',
      openAt,
      startAt,
      hosts: [''],
      hostsInstruments: [''],
      text: '',
      charge: '',
      description: '',
      isWide: true
    }
  },
  computed: {
    labelPosition() {
      return this.isWide ? 'left' : 'top'
    },
    sizeDate() {
      return this.isWide ? 8 : 24
    },
    sizeTime() {
      return this.isWide ? 8 : 12
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
    addHost() {
      this.hosts.push('')
      this.hostsInstruments.push('')
    },
    create() {
      const event = new Event({
        name: this.name,
        openAt: this.openAt,
        startAt: this.startAt,
        hosts: this.hosts,
        hostsInstruments: this.hostsInstruments,
        text: this.text,
        charge: this.charge,
        description: this.description,
        date: this.date,
        createdAt: new Date().getTime()
      })
      console.log(event)
      return firestore
        .collection('users')
        .doc(this.$store.state.uid)
        .collection('events')
        .doc()
        .set(event.toObject())
        .then((responce) => {
          this.$router.push({ name: 'events' })
        })
        .catch((error) => {
          throw error
        })
      /**
       */
    },
    setIsWide() {
      this.isWide = window.innerWidth > 600
    },
    removeHost(index) {
      this.hosts.splice(index, 1)
      this.hostsInstruments.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.arrayForm {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  &__main {
    flex-grow: 1;
  }
  &__button {
    padding: 0 10px;
    font-size: 18px;
    color: #888;
    transition: opacity 0.3s;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
