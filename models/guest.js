import { GUEST_TYPES, INSTRUMENTS } from '@/constants'
export class Guest {
  constructor(params = {}) {
    this.name = params.name || ''
    this.type = params.type || Object.values(GUEST_TYPES)[0]
    this.count = params.count || 0
    this.instruments = this.isPlayer ? params.instruments || [] : []
    this.instrumentMain = this.instruments.includes(params.instrumentMain)
      ? params.instrumentMain
      : this.instruments[0] || null
    this.instrumentOther = this.instruments.includes(INSTRUMENTS.other)
      ? params.instrumentOther
      : null
    this.createdAt = params.createdAt || new Date().getTime()
    if (params.id) this.id = params.id
  }
  get hasInstrumentOther() {
    return this.instruments.includes(INSTRUMENTS.other)
  }
  get isPlayer() {
    return this.type === GUEST_TYPES.player
  }
  get guestText() {
    const instrument =
      this.instrumentMain === INSTRUMENTS.other
        ? this.instrumentOther
        : this.instrumentMain
    return `${this.name} (${instrument})`
  }

  static validate = {
    name(params = {}) {
      return params.name ? undefined : 'Name is required'
    },
    instruments(params = {}) {
      if (params.type === GUEST_TYPES.player && !params.instruments.length)
        return 'At least one instrument must be selected'
    },
    instrumentOther(params = {}) {
      if (
        params.instruments &&
        params.instruments.includes(INSTRUMENTS.other) &&
        !params.instrumentOther
      )
        return 'An instrument is required'
    },
    instrumentMain(params = {}) {
      if (
        params.instruments &&
        params.instruments.length > 1 &&
        !params.instrumentMain
      )
        return 'Main instrument must be selected'
    }
  }
}
