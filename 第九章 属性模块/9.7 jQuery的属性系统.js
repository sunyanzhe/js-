//jQuery 1.0.1
attr = function(element, name, value) {
    var fix = {
        'for': 'htmlFor',
        'class': 'className',
        'float': 'cssFloat',
        innerHTML: 'innerHTML',
        className: 'className',
        value: 'value',
        disabled: 'disabled'
    };
    if (fix[name]) {
        if (value != undefined) element[fix[name]] = value;
        return element[fix[name]]
    } else if (element.getAttribute) {
        if (value != undefined) element.setAttribute(name, value)
        return element.getAttribute(name, 2)
    } else {
        name = name.replace(/-([a-z])/ig, function(z, b) {return b.toUpperCase()})
        if (value != undefined) element[name] = value;
        return element[name];
    }
}

/**
 * 这个方法到1.5.2 这个attr已经接近百行的规模
 * 于是1.6模块, 在jQuery1.5 中的Css模块想出了好方法后, 把cssHooks适配器机制移植过来, 解决了拓展问题
 * 在1.6中存在4个适配器, formHook attrHook propHook valHook
 * formHook 是在对付就版本IE的form元素用的
 * 到了1.6.1增加了一个boolHooks对付布尔属性
 * 到了1.6.3 人们发现IE大多数情况使用getAttributeNode就能获取到正确值, 因此对formHooks重构了一下, 更名为nodeHooks
 */