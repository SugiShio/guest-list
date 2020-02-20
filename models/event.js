import moment from 'moment'
export class Event {
  constructor(params = {}) {
    this.name = params.name || 'Event'
    this.charge = params.charge
    this.text = params.text
    this.createdAt = params.createdAt
    this.openAt = getTimestamp({ date: params.date, time: params.openAt })
    this.startAt = getTimestamp({ date: params.date, time: params.startAt })
    this.hosts = (params.hosts || []).filter((host) => host)
    this.hostsInstruments = (params.hostsInstruments || []).filter(
      (_, index) => params.hosts[index]
    )
    if (params.id) this.id = params.id
    if (params.updatedAt) this.updatedAt = params.updatedAt
  }

  get dateMeta() {
    return this.startAt ? moment(this.startAt).format('YYYY-MM-DD') : null
  }
  get dateText() {
    return this.startAt ? moment(this.startAt).format('YYYY/M/DD') : null
  }
  get startAtText() {
    return this.startAt ? moment(this.startAt).format('HH:mm') : null
  }
  get openAtText() {
    return this.openAt ? moment(this.openAt).format('HH:mm') : null
  }
  get hostTexts() {
    return this.hosts.map(
      (host, index) => `${host} (${this.hostsInstruments[index]})`
    )
  }
}

const getTimestamp = ({ date, time }) => {
  if (!time) return null
  date = new Date(date || time)
  time = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth()
  const date_ = date.getDate()
  const hour = time ? time.getHours() : 0
  const minute = time ? time.getMinutes() : 0
  return new Date(year, month, date_, hour, minute).getTime()
}
