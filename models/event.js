import moment from 'moment'
export class Event {
  constructor(params) {
    this.name = params.name
    this.dateTimestamp = params.date
    this.id = params.id
  }

  get dateMeta() {
    return moment(this.dateTimestamp).format('YYYY-MM-DD')
  }

  get dateText() {
    return moment(this.dateTimestamp).format('YYYY/M/DD')
  }
}
