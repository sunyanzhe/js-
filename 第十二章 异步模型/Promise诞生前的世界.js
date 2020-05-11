/**
 * 发布订阅
 */

class PubSub {
    constructor() {
        this.handlers = {}
    }
    on(type, handler) {
        if (!(type in this.handlers)) this.handlers[type] = []
        this.handlers[type].push(handler)
        return this
    }
    emit(type, ...args) {
        if (type in this.handlers) {
            for (const handler of this.handlers[type]) {
                handler.apply(this, args)
            }
        }
        return this
    }
    off(type, handler) {
        if (handler === undefined) delete this.handlers[type]
        let currentEvents = this.handlers[type]
        if (currentEvents) {
            for (let i = 0; i < currentEvents.length; i++) {
                if (currentEvents[i] === handler) {
                    currentEvents.splice(i, 1); 
                    break
                }
            }
        }
        return this
    }
}