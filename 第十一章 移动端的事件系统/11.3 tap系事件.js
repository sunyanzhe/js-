/**
 * tap事件完全是因为300ms的延迟导致的, 对标PC的点击事件
 * 单击(tap) 双击(double) 此外还存在一种长按(hold)事件
 * 
 * 点击事件在上传域上点击, 会弹出上传菜单, 
 * 如果碰到label元素时, 会让其for属性对应的目标元素选中 
 * 提交按钮 会提交表单
 * 
 * 这些行为 使用模拟的tap事件是实现不了的
 * 我们需要手动创建一个真正的click或mousedown事件, 来实现这些效果
 * 还有要忽略快速触摸而触发的无效点击事件 阻止不必要的放大效果
 * 
 */

// 判断版本
var ua = navigator.userAgent.toLocaleLowerCase()
function iOSversion() {
    if (/iPad|iPhone|iPod/i.test(ua) && !window.MSStream) {
        if ('backdropFilter' in document.documentElement.style) {
            return 9
        }
        if (!!window.indexedDB) {
            return 8
        }
        if (!!window.SpeechSynthesisUtterance) {
            return 7
        }
        if (!!window.webkitAudioContext) {
            return 6
        }
        if (!!window.matchMedia) {
            return 5
        }
        if (!!window.history && 'pushState' in window.history) {
            return 4;
        }
        return 3
    }
    return NaN
}

var deviceIsAndroid = ua.indexOf('android') > 0
var deviceIsIOS = iOSversion()

var Recognizer = {
    pointers: {},
    start: function(event, callback) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changeedTouches[i];
            var pointer = {
                startTouch: minxToucAttr({}, touch),
                startTime: Date.now(),
                status: 'tapping',
                element: event.target
            }
            Recognizer.pointers[touch.identifier] = pointer
            callback(pointer, touch)
        }
    },
    move: function(event, callback) {
        for (var i = 0 ; i < event.changedTouches.length; i++) {
            var touch = event.changedTOuches[i]
            var pointer = Recognizer.pointers[touch.identifier];
            if (!pointer) return;
            if (!('lastTouch' in pointer)) {
                pointer.lastTouch = pointer.startTouch;
                pointer.lastTime = pointer.startTime;
                pointer.deltaX = pointer.deltaY = pointer.duration = pointer.distance = 0;
            }
            var time = Date.now() - pointer.lastTime
            if (time > 0) {
                var RECORD_DURATION = 70;
                if (time > RECORD_DURATION) time = RECORD_DURATION;
                if (pointer.duration + time > RECORD_DURATION) {
                    pointer.duration = RECORD_DURATION - time
                }
                pointer.duration += time;
                pointer.lastTouch = minxToucAttr({}, touch)
                pointer.lastTime = Date.now()
                pointer.deltaX = touch.clientX - pointer.startTouch.clientX;
                pointer.deltaY = touch.clientY - pointer.startTouch.clientY;
                var x = pointer.deltaX * pointer.deltaX;
                var y = pointer.deltaY * pointer.deltaY;
                pointer.distance = Math.sqrt(x + y);
                pointer.isVertical = !(x > y);
                callback(pointer, touch)
            }
        }
    },
    end: function(event, callback) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i],
                id = touch.identifier,
                pointer = Recognizer.pointers[id];
            if (!pointer) continue;
            callback(pointer, touch)
            delete Recognizer.pointers[id]
        }
    }
}