import { autobind } from 'core-decorators'

class Emitter {
  constructor() {
    this.events = {}
  }

  @autobind
  on(eventName, cb) {
    // lazy pollute events map
    if (!(eventName in this.events)) {
      this.events[eventName] = []
    }
    this.events[eventName].push(cb)
  }

  @autobind
  emit(eventName, ...args) {
    if (eventName in this.events) {
      this.events[eventName].map((fx) =>
        fx.apply(this, args)
      )
    }
  }
}

export default Emitter
