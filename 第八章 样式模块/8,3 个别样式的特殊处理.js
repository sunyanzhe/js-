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



