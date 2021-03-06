/**
 * 1. 有意识的屏蔽IE与W3C在阻止默认行为与事件传播的接口差异
 * 2. 处理IE执行回调时的顺序问题
 * 3. 处理IE的this指向问题
 * 4. 没有平台检测代码. 因为是使用最通用原始的onXXX构建
 * 5. 完全跨浏览器
 * 6. 使用UUID来管理事件回调
 */

function addEvent(element, type, handler) {
    // 回调添加UUID, 方便移除
    if (!handler.$$guid) {
        handler.$$guid = addEvent.guid++;
    }
    // 元素添加events, 保存所有类型的回调
    if (!element.events) 
        element.events = {};
    
    var handlers = element.events[type];
    if (!handlers) {
        // 创建一个字对象,保存当前类型的回调
        handlers = element.events[type] = {};
        // 如果元素之前以onXXX=callback的方式绑定过事件, 则成为当前类别的第一个被触发的回调
        // 问题是这回调没有UUID, 只能通过el.onXXX = null来移除
        if (element['on' + type]) {
            handlers[0] = element['on' + type]
        }
    }
    handlers[handler.$$guid] = handler;
    element['on' + type] = handleEvent;
}

addEvent.guid = 1;  // UUID

/**
 * 数据结构为 
 * Element: {
 *  events: {
 *      click: {
 *          0: handler1,  --> handler1.$$guid = addEvent.guid++
 *          5: handler2
 *      }
 *  }
 * }
 */

// 移除事件
function removeEvent(element, type, handler) {
    if (element.events && element.events[type]) {
        delete element.events[type][handler.$$guid]
    }
}

function handleEvent(event) {
    var returnValue = true;
    // 统一事件对象阻止默认行为与事件传统的接口
    // event = event || fixEvent(window.event);
    /**iframe找不到window.event */
    event = event || fixEvent(((this.ownerDocumet || this.document || this).parentWindow || window).event);
    // 根据事件类型, 取得要处理回调集合, 由于UUID是纯数字, 因此可以按照绑定时的顺序执行
    var handlers = this.events[event.type];
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        // 根据返回值判定是否阻止冒泡
        if (this.$$handleEvent(event) === false) {
            returnValue = false
        }
    }
    return returnValue;
}

// 对IE事件对象做简单的修复
function fixEvent(event) {
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
}

fixEvent.preventDefault = function(){
    this.returnValue = false;
}
fixEvent.stopPropagation = function() {
    this.cancelBubble = true;
}


// 为了避免交错引用产出的内存泄漏, 建议元素就分配一个UUID, 所有回调放到一个对象中储存
function addEvent(element, type, handler) {
    if (!handler.$$guid) handler.$$guid = addEvent.guid++;
    if (!element.$$guid) element.$$guid = addEvent.guid++;
    if (!addEvent.handlers[element.$$guid]) addEvent.handlers[element.$$guid] = {};
    // 每个元素的回调都分类存储在不同的hash中
    var handlers = addEvent.handlers[element.$$guid][type];
    if (!handlers) {
        handlers = addEvent.handlers[element.$$guid][type] = {};
        if (element['on' + type]) {
            handlers[0] = element['on' + type];
        }
    }
    handlers[handler.$$guid] = handler;
    element['on' + type] = handleEvent;
}

addEvent.guid = 1;
addEvent.handlers = {};

/**
 * 但随着时间的推移, 使用者发现onXXX在IE存在不可消弭的内存泄漏
 */