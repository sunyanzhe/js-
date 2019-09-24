var isEventSupported = (function() {
    var TAGNAMES = {
        'select': 'input',
        'change': 'input',
        'submit': 'form',
        'reset': 'form',
        'error': 'img',
        'load': 'img',
        'abort': 'img'
    }

    function isEventSupported(eventName) {
        var el = document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] == 'function';
        }
        el = null;
        return isSupported;
    }

    return isEventSupported;
})();


//现在jquery和mass使用的脚本都是其简介版
function eventSupport(eventName, el) {
    el = el || document.documentElement;
    eventName = 'on' + eventName;
    var ret = eventName in el;
    if (el.setAttribute && !ret) {
        el.setAttribute(eventName, '');
        ret = typeof el[eventName] === 'function';
        el.removeAttribute(eventName);
    }
    el = null;
    return ret;
}

