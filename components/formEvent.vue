<template lang="pug">
el-form(
  v-if='eventCopied'
  :label-position='labelPosition'
  label-width='120px')
  el-form-item(
    v-if='isEdit'
    label="Event's Name")
    el-input(v-model='eventCopied.name')
  el-form-item(label='Date')
    .showItem(v-if='!isEdit')
      div {{ event.dateText }}
      div {{ timeText }}
    el-row(v-else)
      el-col(:span='sizeDate')
        el-date-picker(
          v-model='eventCopied.date'
          type='date'
          format='yyyy/M/d'
        )
      el-col(:span='sizeTime')
        el-time-picker(
          v-model='eventCopied.openAt'
          placeholder='Open at'
          :picker-options='{format: "HH:mm"}')
      el-col(:span='sizeTime')
        el-time-picker(
          v-model='eventCopied.startAt'
          placeholder='Start at'
          :picker-options='{format: "HH:mm"}')
  el-form-item(label="Charge")
    .showItem(v-if='!isEdit') {{ event.charge }}
    el-input(
      v-else
      v-model='eventCopied.charge')
  el-form-item(label="Hosts")
    ul.showItem(v-if='!isEdit && hostTexts')
      li(v-for='host in hostTexts') {{ host }}
    template(v-else)
      div.arrayForm(v-for='(host, index) in event.hosts')
        el-row.arrayForm__main
          el-col(:span='16')
            el-input(
              v-model='eventCopied.hosts[index]'
              placeholder='Name')
          el-col(:span='8')
            el-input(
              v-model='eventCopied.hostsInstruments[index]'
              placeholder='Instrument')
        .arrayForm__button(v-if='event.hosts.length>1')
          i.el-icon-circle-close(@click='removeHost(index)')
      el-row
        el-col(:span='24')
          g-button(
            @click='addHost'
            size='mini'
            type='weak'
            inline)
            i.el-icon-plus
            |Add host
  el-form-item(label="Welcome text")
    .showItem(v-if='!isEdit') {{ event.text }}
    el-input(
      v-else
      v-model='eventCopied.text'
      type='textarea')
  el-form-item(label="Thank you text")
    .showItem(v-if='!isEdit') {{ event.thankyouText }}
    el-input(
      v-else
      v-model='eventCopied.thankyouText'
      type='textarea')
  el-form-item(label="Description")
    .showItem(v-if='!isEdit') {{ event.description }}
    el-input(
      v-else
      v-model='eventCopied.description'
      type='textarea')
  section-button(v-if='isEdit')
    g-button(
      @click='$emit("cancel")'
      type='weak') Cancel
    g-button(
      @click='emit'
      :disabled='disabled'
      type='primary') Submit

</template>

<script>
import gButton from '@/components/button'
import sectionButton from '@/components/sectionButton'
import sectionContent from '@/components/sectionContent'
import sectionHead from '@/components/sectionHead'
import { Event } from '@/models/event'
export default {
  components: { gButton, sectionButton, sectionContent, sectionHead },
  props: {
    disabled: { type: Boolean, default: false },
    event: { type: Event, required: true },
    isEdit: { type: Boolean, default: false }
  },
  data() {
    return {
      date: this.event.startAt,
      eventCopied: null,
      isWide: false
    }
  },
  computed: {
    hostTexts() {
      return this.event.hosts
        .filter((host) => host)
        .map((host, index) => `${host} (${this.event.hostsInstruments[index]})`)
    },
    labelPosition() {
      return this.isWide ? 'left' : 'top'
    },
    sizeDate() {
      return this.isWide ? 8 : 24
    },
    sizeTime() {
      return this.isWide ? 8 : 12
    },
    timeText() {
      const open = this.event.openAt ? `Open ${this.event.openAtText}` : null
      const start = this.event.startAt
        ? `Start ${this.event.startAtText}`
        : null
      return [open, start].join(' / ')
    }
  },
  watch: {
    isEdit(value) {
      if (value) this.eventCopied = { ...this.event, date: this.event.startAt }
    }
  },
  mounted() {
    this.eventCopied = { ...this.event, date: this.event.startAt }
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
      this.event.hosts.push('')
      this.event.hostsInstruments.push('')
    },
    emit() {
      this.$emit('submit', this.eventCopied)
    },
    setIsWide() {
      this.isWide = window.innerWidth > 600
    },
    removeHost(index) {
      this.event.hosts.splice(index, 1)
      this.event.hostsInstruments.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/utils';
.arrayForm {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  &__main {
    flex-grow: 1;
  }
  &__button {
    @extend %hoverOpacity;
    padding: 0 10px;
    font-size: 18px;
    color: #888;
  }
}
.showItem {
  padding-top: 7px;
}
</style>
