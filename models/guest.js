export class Guest {
  constructor(params) {
    this.name = params.name || 'No name guest'
    this.type = params.type
    this.count = params.count || 0
    this.instruments = this.isPlayer ? params.instruments : []
    this.instrumentMain = this.instruments.includes(params.instrumentMain)
      ? params.instrumentMain
      : this.instruments[0] || null
    this.instrumentOther = this.instruments.includes('Other')
      ? params.instrumentOther
      : null
    this.createdAt = params.createdAt || new Date().getTime()
    if (params.id) this.id = params.id
  }
  get isPlayer() {
    return this.type === 'Player'
  }
  get guestText() {
    const instrument =
      this.instrumentMain === 'Other'
        ? this.instrumentOther
        : this.instrumentMain
    return `${this.name} (${instrument})`
  }
}
