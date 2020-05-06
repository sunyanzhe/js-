/**
 * IOS 2.0 中的Safari还引入了一组手势事件, 当两个手指触摸屏幕时就会产生手势, 手势通常会改变显示项大小, 或者旋转显示项.
 * 有3个手势事件, 分别如下
 * 1. gesturestart 当一个手指已经按在屏幕上面时, 另一个手指也触摸屏幕时触发
 * 2. gesturechange 当触摸屏幕的任何一个手指的位置发生变化时触发
 * 3. gestureend 当任何一个手指从屏幕上面移开时触发
 * 
 * 只有两个手指都触摸到屏幕时才会触发这些事件. 
 * 在一个元素上设置事件处理程序, 意味着两个手指必须同时位于钙元素的范围之内, 才能触发手势事件(这个元素就是目标元素)
 * 由于这些事件冒泡,所以将事件处理程序放在文档上也可以处理所有手势事件, 此时事件的目标就是两个手指都位于其范围内的那个元素
 * 
 * 触摸事件和手势事件之间存在着联系
 * 当一个手指放到屏幕上时, 触发touchstart事件
 * 如果另一个手指又放在了屏幕上, 先触发gesturestart事件, 再触发基于这个手指的touchstart事件
 * 如果一个或两个手指在屏幕上滑动, 将会触发gesturechange事件
 * 但只要有一个手指移开, 就会触发gestureend事件, 紧接着又会触发基于该手指的touchend事件
 * 
 * 与触摸事件一样, 每个手势事件的event对象都包含这标注你的鼠标事件属性, bubbles cancelable view clientX clientY pageX pageY screenX screenY detail altKey ctrlKey shiftKey metaKey
 * 此外还包含两个额外属性: rotation和scale
 * 其中rotation属性表示手指变化引起的旋转角度, 负值为逆时针旋转, 正值表示顺时针旋转,
 * scale属性表示两个手指间距的变化情况, 距离拉大而增长,距离缩减而减小 默认为1
 */

// 例子
function handleGestureEvent(event) {
    var output = document.getElementById('output');
    switch (event.type) {
        case 'gesturestart':
            output.innerHTML = "Gesture started (rotation=" + event.rotation + ", scale=" + event.scale + ")"
            break;

        case 'gesturechange':
            output.innerHTML += "Gesture change (rotation=" + event.rotation + ", scale=" + event.scale + ")"
            break;

        case 'gestureend':
            output.innerHTML += "Gesture end (rotation=" + event.rotation + ", scale=" + event.scale + ")"
            break;
    
        default:
            break;
    }
}

document.addEventListener('gesturestart', handleGestureEvent, false)
document.addEventListener('gesturechange', handleGestureEvent, false)
document.addEventListener('gestureend', handleGestureEvent, false)


// 判断浏览器是否支持触屏事件
var isIOS = /ip(?=ad|hone|od)/.test(navigator.userAgent)
var IE11touch = navigator.pointerEnabled
var IE9_10touch = navigator.msPointerEnabled

var w3ctouch = (function(){
    var supported = isIOS || false;
    try {
        var div = document.createElement('div')
        div.ontouchstart = function() {supported = true}
        var e = document.createEvent('TouchEvent')
        e.initUIEvent('touchstart', true, true)
        div.dispatchEvent(e)
    } catch(err) {}

    div = div.ontouchstart = null
    return supported
})()

var touchSupported = !!(w3ctouch || IE11touch || IE9_10touch)