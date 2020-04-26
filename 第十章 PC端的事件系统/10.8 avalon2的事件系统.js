/**
 * 有一些表单事件只冒泡到form, 有的冒泡到document, 有的压根不冒泡
 * 
 *           IE6         IE8         FF3.6           Opera10             Chrome4             Safari
 * submit   form        form        document        document            document            document
 * reset    form        form        document        document            form                form
 * change   不冒泡      不冒泡      document        document            不冒泡              不冒泡
 * click    document    document    document        document            document            document
 * select   不冒泡      不冒泡      document        document            不冒泡              不冒泡
 * 
 * 对于focus blur change submit reset select等不会冒泡的事件, 在标准浏览器中, 我们可以将其改为捕获, 就是addEventListener的最后一个参数为ture
 * IE就有点麻烦了 要用focusin代替focus, focusout代替blur selectstart代替select
 * change submit与reset就复杂了, 必须利用其他事件来模拟, 还要判断事件源的类型, selectedIndex, keyCode等相关属性
 */

/**
 * avalon.bind 与业界常见的addEvent方法一样 拥有3个参数
 * 1. el: 绑定事件的对象
 * 2. type: 事件的类型, 可以是自定义事件
 * 3. fn: 事件回调, 第一个参数总是事件对象, 并且拥有type与target属性
 * 
 * 然后avalon拥有3个专门辅助事件系统的对象, 用于修正最初传入的事件名, 回调及存放地点
 * 1. bubbleEvents: 存储所有能冒泡的事件类型, 并且针对不同浏览器有所增删, 键名为事件名, 值为true
 * 2. eventHooks:用于处理特殊事件, 键名为事件名, 值为一个钩子函数, 要求将初始参数传进去, 最后返回一个新的回调
 *      如滚轮, mouseenter/leave等难缠的事件就需要在钩子方法中处理
 * 3. eventListeners: 存放回到函数, 如果原事件是命中eventHooks, 那么存放的是新回调, 键名是uuid, 它位于回调的上面
 */

// 所有可以冒泡的事件类型 键名为事件名, 值为true
var canBubbleUp = avalon.bubbleEvents = require('./bubbleEvents');

if (!W3C) {
    delete canBubbleUp.change;
    delete canBubbleUp.select;
}

var uuid = 1;

// 钩子函数, 用于处理特殊事件
var eventHooks = avalon.eventHooks;

var focusBlur = {
    focus: true,
    blur: true
}

// 绑定事件

avalon.bind = function(elem, type, fn) {
    // 如果是元素节点
    if (elem.nodeType === 1) {
        // 获取已有的事件类型
        var value = elem.getAttribute('avalon-events') || '';
        var uuid = fn.uuid || (fn.uuid = ++uuid);
        var hook = eventHooks[type];
        if (hook) {
            type = hook.type || type;
            if (hook.fix) {
                fn = hook.fix(elem, fn);
                fn.uuid = uuid;
            }
        }
        var key = type + ':' + uuid;
        avalon.eventListeners[fn.uuid] = fn
        if (value.indexOf[type + ':'] === -1) {
            // 同一事件只绑定一次
            // 对于能冒泡的事件, 或现在浏览器下的focus blur事件使用事件代理
            // 因为现代浏览器可以使用事件捕获方法监听事件
            if (canBubbleUp[type] || (avalon.modern && focusBlur[type])) {
                delegateEvent(type)
            } else {
                nativeBind(elem, type, dispatch)
            }
        }

        var keys = value.split(',');
        if (keys[0] === '') keys.shift();
        if (keys.indexOf(key) === -1) {
            keys.push(key);
            elem.setAttribute('avalon-events', keys.join(','))
        }
    } else {
        nativeBind(elem, type, fn)
    }
    return fn
}

function delegateEvent(type) {
    var value = root.getAttribute('delegate-events') || '';
    if (value.indexOf(type) === -1) {
        var arr = value.match(avalon.rword) || [];
        arr.push(type);
        root.setAttribute('delegate-events', arr.join(','));
        nativeBind(root, type, dispatch, !!focusBlur[type]);
    }
}

/**
 * delegeteEvent内部也是调用dispatch事件, 只是把绑定地点换成了根节点
 * dispatch事件做了3件事情, 解决兼容性问题
 * 1. 对原生事件对象进行再次封装, 解决事件对象的方法名和属性名不一致问题, 并针对某些特殊事件(如IE有 Chrome没有的mouseenter/leave事件和FireFox不支持的mousewheel事件), 我们这里事件冒充(用mouseover事件冒充mousenter事件)
 * 2. 通过event.target得到事件源对象, 从而访问到avalon-events属性值, 然后根据event.type得到所有相对UUID, 再从eventListeners得到回调. 这些步骤通过collectHandlers私有方法实现
 * 3. 遍历所有回调, 根据事件冒泡与返回值, 设置一些分支, 实现stopPropagation与stopImmediatePropagation
 */