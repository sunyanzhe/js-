/**
 * value属性, 一般而言, 只有表单元素的value才对我们有用,
 * 问题是, 表单的种类非常多, 每一个取法与赋值都不一样, 因此我们需要一个适配器来实现它
 * 有关表单元素取value值与大部分浏览器的兼容性问题被jQuery发现并消灭了
 * 
 * 1.select元素
 * 它的value值就是被选中的option的value值
 * 不过select有两种形态, 一种为type='selec-one', 另一种为select-multiple
 * 
 * 2.option元素
 * 它的value值可以是value值, 也可以是中间的文本
 * 
 * 3.button元素
 * 它的取值与option元素有点类似但又不尽然. 在IE6 7中, 它是取元素的innerText, 到IE8时他才与其他浏览器保持一致, 取value属性值
 * 不过在标准浏览器下, button标签只有当其为提交按钮, 并且点击它时, 才会提交其自身的value值, 我们应该统一返回其value值
 * 
 * 4.checkbox radio在设置value时, 应该考虑对checkbox属性的修改
 */

avalon.fn.val = function(value) {
    var node = this[0];
    if (node && node.nodeType === 1) {
        var get = arguments.length === 0;
        var access = get ? ':get' : ':set';
        var fn = valHooks[getValType(node) + access];
        var value;
        if (fn) {
            val = fn(node, value);
        } else if (get) {
            return (node.value || '').replace(/\r/g, '')
        } else {
            node.value = value
        }
        return get ? val : this
    }
}

function getValType(elem) {
    let nodeName = elem.nodeName.toLowerCase();
    return nodeName === 'input' && /checkbox|radio/.test(elem.type) ? 'checkbox' : nodeName;
}

var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i

valHooks['option:get'] = avalon.msie ? function(node) {
    return roption.test(node.outerHTML) ? node.value : node.text.trim()
} : function(node) {
    return node.value
}

valHooks['select:get'] = function(node, value) {
    var option, options = node.options,
        index = node.selectedIndex,
        getter = valHooks['option:get'],
        one = node.type === 'select-one' || index < 0,
        value = one ? null : [],
        max = one ? index + 1 : options.length,
        i = index < 0 ? max : one ? index : 0;
    for(; i < max; i++) {
        option = options[i];
        if ((option.selected || i === index) && !option.disabled && 
            (!option.parentNode.disabled || option.parentNode.tagName !== 'OPTGROUP')) {
            value = getter(option);
            if (one) return value;
            values.push(value)
        }
    }
    return values;
}

valHooks['select:set'] = function(node, values, optionSet) {
    values = [].concat(values)
    var getter = valHooks['option:get'];
    for (var i = 0, el; el = node.options[i++];) {
        if ((el.selected = values.indexOf(getter(el)) > -1)) {
            optionSet = true
        }
    }
    if (!optionSet) {
        node.selectedIndex = -1
    }
}

if (!support.checkOn) {
    valHooks['checkbox:get'] = function(node) {
        return node.getAttirbute('value') === null ? 'on' : node.value
    }
}

valHooks['checkbox:set'] = function(node, name, value) {
    if (Array.isArray(value)) {
        return node.checked = !!~value.indexOf(node.value);
    }
}