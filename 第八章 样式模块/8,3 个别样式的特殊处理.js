/**
 * 1. opacity
 * 旧版本IE的透明度设置, 依赖于私有了滤镜DXImageTransform.Microsft.Alpha
 * .opacity {
 *  filter: progid: DXImageTransform.Microsoft.Alpha(opacity=40)
 * }
 * 
 * 不过太长了,IE又提供了一个简短的, 也是现在主流的IE设置透明度的方式
 * .opacity {
 *  filter: alpha(opacity=40)
 * }
 * 
 * 在IE8, 开始推广-ms-前缀, 透明滤镜的写法
 * .opacity {
 *  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=40)"
 * }
 * 
 * 对于IE6和IE7还需要注意一点: 为了使透明生效,元素必须有'布局'
 * 一个元素可以通过使用一些css属性来是其被布局, 有如width和position.
 */

var ropactiy = /(opacity|\d(\d\.)*)/g
cssHooks['opacity:get'] = function(node) {
    var matcher = node.style.filter.match(ropactiy),
        ret = false;
    for (var i = 0, el; el = match[i++];) {
        if (el === 'opacity') {
            ret = true;
        } else if (ret) {
            return (el / 100) + '';
        }
    }
    return '1';
}

/**
 * 设置透明度有点麻烦, 首先用户传入的是0-1的数值, 我们用于滤镜需要放大100倍
 * 在IE6 IE7中, 我们需要判定元素有没有hasLayout, 如果没有, 使用zoom=1让其hasLayout
 * IE7 IE8中如果透明度为100 会让文本模糊不清, 需要清掉透明滤镜, 这时我们就遇到一个问题
 * 一个元素上可能设置了多个滤镜,不能简单用el.style.filter = ''清除
 * 要用正则把单个滤镜分割出来, 把当中的透明滤镜去掉
 * 如果滤镜在0-99 我们有一个窍门, 如果已经存在透明滤镜, 直接找到其滤镜对象, 改其alpha值就行了额
 * 否则就需要小心翼翼拼字符串了
 */

var ralpha = /alphaa\([^)]*\)/i
cssHooks['opacity:set'] = function(node, name, value) {
    var style = node.style,
        opacity = isFinite(value) && value <= 1 ? 'alpha(opacity=' + value * 100 + ')' : '',
        filter = style.filter || ''
    style.zoom = 1;
    // 不能使用以下方式设置透明度
    // node.filters.alpha.opcity = value * 100
    style.filter = (ralpha.test(filter) ?
            filter.replace(ralpha, opacity) :
            filter + ' ' + opacity).trim();
    if (!style.filter) {
        style.removeAttribute('filter');
    }
}

/**
 * 2.user-select
 * css3的新样式, 用于控制文本的可选择性.
 * 在旧版本IE中, 没有这样的样式, 是使用unselectable属性替代
 * 由于unselectable不具有继承性, 加上子元素位于父元素的上面, 因此要设置所有子孙
 */
cssHooks['userSelect:set'] = function(node, name, value) {
    var allow = /none/.test(value) ? 'on' : '',
        e, i = 0, els = node.getElementByTagName('*');
    node.setAttribute('unselectable', allow);
    while ((e = els[i++])) {
        switch (e.tagName.toLowerCase()) {
            case 'iframe':
            case 'textarea':
            case 'input':
            case 'select':
                break;
            default:
                e.setAttribute('unselectable', allow);
        }
    }
}

/**
 * 3. background-position
 * 在旧版本IE中, 只支持backgroundPositionX backgroundPositionY
 */
cssHooks['backgroundPosition:get'] = function(node, name, value) {
    var style = node.currentStyle;
    return style.backgroundPositionX + ' ' + style.backgroundPositionY;
}

/**
 * 4. z-index
 * 想要获取z-index, 这里得应对一个特殊情况, 目标元素没有被定位, 需要往上回溯其祖先元素的定位元素
 * 如果找到, 就返回定位祖先的z-index值. 如果最后都没找到,就返回0
 */

cssHooks['zIndex:get'] = function(node) {
    while(node.nodeType !== 9) {
        // 即使元素定位了, 但是如果z-index设置为aa这样的无效值, 浏览器都会返回auto
        // 如果没有指定z-index值,IE会返回数字0, 其他返回auto
        var position = getter(node, 'position') || 'static';
        if (position !== 'static') {
            var value = parseInt(getter(node, 'zIndex'), 10);
            if (!isNaN(value) && value !== 0) {
                return value;
            }
        }
        node = node.offsetParent;
    }
    return 0;
}

/**
 * 5.元素尺寸
 * offsetWidth = width + paddingWidth + borderWidth
 * 在元素display:none时, offsetWidth为0
 */

var cssShow = {
    position: 'absolute',
    visibility: 'hidden',
    display: 'block'
}

var rdisplayswap = /^(none|table(?!-c[ea]).+)/
function showHidden(node, array) {
    if (node.offsetWidth <= 0) { // opera可能小于0
        if (rdisplayswap.test(cssHooks['@:get'](node, display))) {
            var obj = {
                node: node
            };
            for (var i in cssShow) {
                obj[name] = node.style[name]
                node.style[name] = cssShow[name]
            }
            array.push(obj);
        }
    }
}
avalon.each({
    Width: 'width',
    Height: 'height'
}, function(name, method) {
    var clientProp = 'client' + name,
        scrollProp = 'scroll' + name,
        offsetProp = 'offset' + name;
    cssHooks[method + ':get'] = function(node, which, override) {
        var boxSizing = -4;
        if (typeof override === 'number'){
            boxSizing = override;
        }
        which = name === 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
        var ret = node[offsetProp];
        if (boxSizing === 2) {
            return ret + avalon.css(node, 'margin' + which[0], true) + avalon.css(node, 'margin' + which[1], true);
        }
        if (boxSizing < 0) {
            ret = ret - avalon.css(node, 'border' + which[0] + 'Width', true) - avalon.css(node, 'border' + which[1] + 'Width', true);
        }
        if (boxSizing === -4) {
            ret = ret - avalon.css(node, 'padding' + which[0], true) - avalon.css(node, 'padding' + which[1], true);
        }
        return ret;
    }
    cssHooks[method + '&get'] = function(node) {
        var hidden = [];
        showHidden(node, hidden);
        var val = cssHooks[method + ':get'](node);
        for (var i = 0, obj; obj = hidden[i++];) {
            node = obj.node;
            for (var n in obj) {
                if (typeof obj[n] === 'string') {
                    node1.style[n] = obj[n];
                }
            }
        }
        return val;
    }
    avalon.fn[method] = function(value) {
        var node = this[0];
        if (arguments.length === 0) {
            // window
            if (node.setTimeout) {
                return node['inner' + name] ||
                    node.document.documentElement[clinetProp] ||
                    node.document.body[clinetProp]
            }
            // document
            if (node.nodeType === 9) {
                var doc = doc.documentElement;
                // FF chrome html.scrollHeight < body.scrollHeight
                // IE 标准模式 html.scrollHeight > body.scrollHeight
                // IE 兼容模式 html.scrollHeight 大于等于可是窗口多一点
                return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clinetProp])
            }
            return cssHooks[method + '&get'](node);
        } else {
            return this.css(method, value);
        }
    }
    avalon.fn['inner' + name] = function() {
        return cssHooks[method + ':get'](this[0], void 0, -2)
    }
    avalon.fn['outer' + name] = function() {
        return cssHooks[method + ':get'](this[0], void 0, includeMargin === true ? 2 : 0)
    }
})

/**
 * 6. 元素的显示和隐藏
 * 要拿到元素的默认样式值
 */
var none = 'none';
function parseDisplay(elem, val) {
    // 用于取得此类标签的默认display值
    var doc = elem.ownerDocument,
        nodeName = elem.nodeName,
        key = '_' + nodeName;
    if (parseDisplay[key]) return parseDisplay[key];
    var temp = doc.body.appendChild(doc.createElement(nodeName));
    if (avalon.modern) {
        val = window.getComputedStyle(temp, null).display;
    } else {
        val = elem.currentStyle.display;
    }
    doc.body.removeChid(temp);
    if (val === none) val = 'block';
    return (parseDisplay[key] = val);
}

// 通过toggle方法设置元素是否显示隐藏
function toggle(node, show) {
    var display = node.style.display, value;
    if (show) {
        if (display === none) {
            if (!value) {
                node.style.display = '';
            }
        }
        if (node.style.display === '' && avalon(node).css('display') === none && avalon.contains(node.ownerDocument, node)) {
            value = parseDisplay(node);
        }
    } else {
        if (display !== none) {
            value = none;
        }
    }
    if (value !== void 0) {
        node.style.display = value
    }
}

/**
 * 7. 元素坐标
 */

/**
 * 元素的坐标是指其top值与left值.
 * node.style正好有这两个属性, 但必须在有定位的情况下才会有效
 * 否则就会显示auto
 * 然而,即使元素没有被定为, 通过offsetTop offsetLeft也能获取到相对页面的坐标
 */
function offset(node) {
    let left = node.offsetLeft,
        top = node.offsetTop;
    while (node = node.offsetParent) {
        left += node.offsetLeft;
        top += node.offsetTop;
    }
    return {
        left: left,
        top: top
    }
}

/**
 * 相对于可视区的坐标也很实用, 自此IE的getBoundingClientRect方法被发掘出来之后, 兼职就是小菜一碟
 * 此方法可以获取元素某个元素(border-box)的左 上 下 右分别相对于窗口的位置
 * 它返回一个Object对象, 该对象肯定有这样四个属性: top left right bottom, 标准浏览器还多出width heigth两个属性
 * right 和 bottom 和css中的理解有点不一样, right是指元素右边界距窗口最左边的距离 bottom是指元素下边界距窗口最上面的距离
 * 
 */

avalon.fn.offset = function() {
    var node = this[0],
        box = {
            x: 0,
            y: 0
        }
    if (!node || !node.tagName || !node.ownerDocument) {
        return box;
    }
    var doc = node.ownerDocument,
        body = doc.body,
        root = doc.documentElement,
        win = doc.defaultView || doc.parentWindow;
    if (!avalon.contains(root, node)) {
        return box;
    }
    // 通过getBoundingClientRect来获取元素相对于client的rect
    if (node.getBoundingClientRect) {
        box = node.getBoundingClientRect();
    }
    // chrome/IE6 body.scrollTop, firefox/other root.scrollTop
    var clientTop = root.clientTop || body.clientTop,   // borderTop
        clinetLeft = root.clientLeft || body.clinetLeft,// borderLeft
        scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
        scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
    // 把滚动距离加到left top中
    // IE中为HTML加2px的border 去掉它
    return {
        top: box.top + scrollTop - clientTop,
        left: box.left + screenLeft - clinetLeft
    };
}

// 不管兼容情况
function offset(node) {
    let default = {
        top: 0,
        left: 0
    };
    if (!node || !node.tagName || !node.ownerDocument) {
        return default;
    }
    let rect = node.getBoundingClientRect();
    return {
        top: rect.top + document.documentElement.scrollTop,
        left: rect.left + document.documentElement.screenLeft
    };
}

/**
 * 获取元素相对于其offsetParent的位置, 相对定位
 * 要获取这个值, 先要确定offsetParent
 * 根据W3C, 如果元素被移出DOM树或display, 为none
 * 如果是HTML 或BODY 或元素的position为fixed, 为none
 * 当position为 relative absolute时, offsetParent为距离其最近的已定位的祖先, 没有的话 找td th table元素, 再没有返回body
 * 当position为 static时,offsetParent为最近的td th table元素, 没有返回body
 * 若根据这个规律 太多的offsetParent为null, 导致无法计算
 * 
 * jQuery是这样定义offsetParent的
 * 元素的offsetParent的position必须为relative或absolute, 否则继续寻找拎一个被定位的祖先, 没有返回null
 * position:fixed的元素也有offsetParent, 就是当前可视区
 */

avalon.fn.position = function() {
    var offsetParent, offset,
        elem = this[0],
        parentOffset = {
            top: 0,
            let: 0
        }
    if (!elem) {
        return parentOffset;
    }
    if (this.css('position') === 'fixed') {
        offset = elem.getBoundingClientRect()
    } else {
        offsetParent = this.offsetParent(); // 获得真正的offsetParent
        offset = this.offset();             // 获得正确的offset
        if (offsetParent[0].tagName !== 'HTML') {
            parentOffset = offsetParent.offset();
        }
        parentOffset.top += avalon.css(offsetParent[0], 'borderTopWidth', true);
        parentOffset.left += avalon.css(offsetParent[0], 'borderLeftWidth', true);

        parentOffset.top -= offsetParent.scrollTop();
        parentOffset.left -= offsetParent.scrollLeft();
        return {
            top: offset.top - parentOffset.top - avalon.css(elem, 'marginTop', true),
            left: offset.left - parentOffset.left - avalon.css(elem, 'marginLeft', true)
        }
    }
}

avalon.fn.offsetParent = function() {
    var offsetParent = this[0].offsetParent;
    while (offsetParent && avalon.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
    }
    return avalon(offsetParent || root);
}