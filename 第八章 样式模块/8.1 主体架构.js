// 通用
/**
 * 通用
 * avalon.fn.css
 * avalon.css
 * 
 * 长宽相关
 * avalon.fn.width
 * avalon.fn.innerWidth
 * avalon.fn.outerWidth
 * avalon.fn.height
 * avalon.fn.innerHeight
 * avalon.fn.outerHeight
 * 
 * 位置相关
 * avalon.fn.position
 * avalon.fn.offset
 * avalon.fn.scrollTop
 * avalon.fn.scrollLeft
 * avalon.fn.offsetParent
 */

avalon.fn.css = function(name, value) {
    if (avalon.isPlainObject(name)) {
        for (var i in name) {
            avalon.css(this, i, value)
        }
    } else {
        var ret = avalon.css(this, name, value);
    }
    return ret !== void 0 ? ret : this;
}

avalon.css = function (node, name, value) {
    if (node instanceof avalon) {
        node = node[0];
    }
    var prop = avalon.camelize(name), fn;
    name = avalon.cssName(prop) || prop;
    // 获取样式
    if (value === void 0 || typeof value === 'boolean') {
        fn = cssHooks[prop + ':get'] || cssHooks['@:get'];
        if (name === 'background') {
            name = 'backgroundColor';
        }
        var val = fn(node, name);
        return value === true ? parseFloat(val) || 0 : val;
    // 清除样式
    } else if (value === '') {
        node.style[name] = '';
    // 设置样式
    } else {
        if (value === null || value !== value) return;
        if (isFinite(value) && !avalon.cssNumber[prop]) {
            value += 'px';
        }
        fn = cssHooks[prop + ':set'] || cssHooks['@:set'];
        fn(node, name, value)
    }
}

cssHooks['@:set'] = function(node, name, value) {
    try {
        // node.style.width = NaN; 
        // node.style.width = undefined
        // node.style.width = 'xxx'
        // IE 都抛异常
        node.style[name] = value;
    } catch (error) {
        
    }
}
if (window.getComputedStyle) {
    cssHooks['@:get'] = function(node, name) {
        if (!node || !node.style) {
            throw new Error('getComputedStyle 需要传入一个节点' + node);
        }
        var ret, styles = window.getComputedStyle(node);
        if (styles) {
            ret = name === 'filter' ? styles.getPropertyValue(name) : styles[name];
            if (ret === '') {
                ret = node.style[name];
            }
        }
        return ret;
    }
} else {
    var rumnonpx = /^-?(?:\d*\.)?\d+(?!p)[^\d\s]+$/i,
        rposition = /^(top|right|bottom|left)$/,
        ralpha = /alpha\([^)]*\)/i,
        ie8 = !!window.XDomainRequest,
        salpha = 'DXImageTransform.Microsoft.Alpha',
        border = {
            thin: ie8 ? '1px': '2px',
            medium: ie8 ? '3px': '4px',
            thick: ie8 ? '5px': '6px'
        };
    cssHooks['@:get'] = function(node, name) {
        // 获取精确值, 不过他有可能带em pc mm pt %等单位
        var currentStyle = node.currentStyle,
            ret = currentStyle[name];
        if (rumnonpx.test(ret) && !rposition.test(ret)) {
            // 保存原有的style.left 和 runtimestyle.Left
            var style = node.style,
                left = style.left,
                rsLeft = node.runtimeStyle.left;
            // runtimeStyle的权重最高,当设置了它的值之后, 在style设置同样name 元素不会改变样式
            // 这样就可以随便进行下面的操作了
            node.runtimeStyle.left = currentStyle.left;
            
            // 通过给left赋值后, 在使用style.piexlLeft获取以px为单位的精确值
            style.left = name === 'fontSize' ? '1em' : (ret || 0);
            ret = style.pixelLeft + 'px';

            // 还原left
            style.left = left;
            node.runtimeStyle.left = rsLeft;
        }
        if (ret === 'medium') {
            name = name.replace('Width', 'Style');
            // border width默认值为medium, 即使为0
            if (currentStyle[name] === 'none') {
                ret = '0px';
            }
        }
        return ret === '' ? 'auto' : border[ret] || ret
    }
}