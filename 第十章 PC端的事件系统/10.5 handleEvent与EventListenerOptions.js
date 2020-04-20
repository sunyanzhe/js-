// DOM2开始支持另一种形式, handle为一个对象, 里面有一个handleEvent方法
var events = {
    attr: 222,
    handleEvent: function(event) {
        console.log(this.attr);
        switch(event.type) {
            case 'touchstart': this.touchstart(event); break
            case 'touchmove': this.touchmove(event); break
            case 'touched': this.touchend(event); break
        }
    },
    touchstart: function() {},
    touchmove: function() {},
    touchend:function() {}
}

el.addEventListener('touchstart', events, false)
el.addEventListener('touchmove', events, false)
el.addEventListener('touched', events, false)


/**
 * 这样写有两个好处
 * 1. 将所有事件回调都集中到一个对象上, 方便共享信息, 比如上面例子的attr, 由于this直接指向这个对象, 我们就直接可以通过e.target.attr访问它的值
 * 2. 动态改变事件处理器, 通过e.type或其他信息调度相关的回调, 不用先remove再add
 */

// 2016, firefox开始支持DOM4的EventListenerOptions:
dom.addEventListener(type, handler, EventListenerOptions)

/**
 * EventListenerOptions有3个可配置项, 如果不写默认都是false
 * 1. capture, 与之前一样, 决定冒泡还是捕获
 * 2. passive, 为true时, 会将回调里的e.preventDefault()操作无效化
 * 3. once, 为true时, 此事件回调会只执行一次就自动解绑
 */

//  这个兼容性很差