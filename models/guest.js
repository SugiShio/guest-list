import { GUEST_TYPES, VALUE_OTHER } from '@/constants'
import moment from 'moment'
export class Guest {
  constructor(params = {}) {
    this.name = params.name || ''
    this.type = params.type || Object.values(GUEST_TYPES)[0]
    this.count = params.count || 0
    this.instruments = this.isPlayer ? params.instruments || [] : []
    this.instrumentMain = this.instruments.includes(params.instrumentMain)
      ? params.instrumentMain
      : this.instruments[0] || null
    this.instrumentOther = this.instruments.includes(VALUE_OTHER)
      ? params.instrumentOther
      : null
    this.createdAt = params.createdAt || new Date().getTime()
    if (params.id) this.id = params.id
  }
  get createdAtText() {
    return moment(this.createdAt).format('H:mm')
  }
  get hasInstrumentOther() {
    return this.instruments.includes(VALUE_OTHER)
  }
  get isPlayer() {
    return this.type === GUEST_TYPES.player
  }
  get guestText() {
    return `${this.name} (${this.part})`
  }
  get part() {
    let part
    if (this.type === GUEST_TYPES.listener) part = 'Listener'
    else if (this.instrumentMain === VALUE_OTHER) part = this.instrumentOther
    else part = this.instrumentMain
    return part
  }

  static validate = {
    name(params = {}) {
      return params.name ? undefined : 'nameIsRequired'
    },
    instruments(params = {}) {
      if (params.type === GUEST_TYPES.player && !params.instruments.length)
        return 'atLeastOneInstrumentMustBeSelected'
    },
    instrumentOther(params = {}) {
      if (
        params.instruments &&
        params.instruments.includes(VALUE_OTHER) &&
        !params.instrumentOther
      )
        return 'anInstrumentIsRequired'
    },
    instrumentMain(params = {}) {
      if (
        params.instruments &&
        params.instruments.length > 1 &&
        !params.instrumentMain
      )
        return 'mainInstrumentMustBeSelected'
    }
  }
}
