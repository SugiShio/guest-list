export class Guest {
  constructor(params) {
    this.name = params.name || 'No name guest'
    this.type = params.type
    this.instruments = this.isPlayer ? params.instruments : []
    this.instrumentMain = this.instruments.includes(params.instrumentMain)
      ? params.instrumentMain
      : this.instruments[0]
    this.instrumentOther = this.instruments.includes('Other')
      ? params.instrumentOther
      : undefined
    this.createdAt = params.createdAt || new Date().getTime()
    if (params.id) this.id = params.id
  }
  get isPlayer() {
    return this.type === 'Player'
  }
  toObject() {
    const object = {}
    Object.keys(this).forEach((key) => {
      object[key] = this[key]
    })
    return object
  }
}
