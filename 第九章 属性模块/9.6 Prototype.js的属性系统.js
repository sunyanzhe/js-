/**
 * prototype做出了以下贡献
 * 1. 名字映射的发明
 * 2. href,src的IE处理
 * 3. getAttributeNode的发掘
 * 4. 事件钩子的处理
 * 5. 布尔属性的处理
 * 6. style属性的IE处理
 */

Element._attributeTranslations = (function(){
    // 判断浏览器是否支持用class代替className
    var classProp = 'className',
        forProp = 'for',
        el = document.createElement('div');
    el.setAttribute(classProp, 'x');
    if (el.className !== 'x') {
        el.setAttribute('class', 'x');
        if (el.className === 'x') {
            classProp = 'class';
        }
    }
    el = null;

    el = document.createElement('label');
    el.setAttribute(forProp, 'x');
    if (el.htmlFor !== 'x') {
        el.setAttribute('htmlFor', 'x');
        if (el.htmlFor === 'x') forProp = 'htmlFor';
    }
    el = null;
    return {
        read: {
            names: { // 名字映射
                'class': classProp,
                'className': classProp,
                'for': forProp,
                'htmlFor': forProp
            },
            values: { // 钩子函数对象
                // 处理自定义属性
                _getAttr: function(element, attribute) {
                    return element.getAttribute(attribute)
                },
                // 处理src href路径属性
                _getAttr2: function(element, attribute) {
                    return element.getAttribute(attribute, 2)
                },
                // 处理ID相关固有属性
                _getAttrNode: function(element, attribute) {
                    var node = element.getAttributeNode(attribute);
                    return node ? node.value : ''
                },
                // 处理事件 onXXX
                _getEv: (function() {
                    return function(){}
                })(),
                // 处理readOnliy, disabled布尔属性
                _flag: function(element, attribute) {
                    return $(element).hasAttribute(attribute) ?
                        true : null
                },
                // 处理样式
                style: function(element) {
                    return element.style.cssText.toLowerCase();
                },
                // 处理title
                title: function(element) {
                    return element.title;
                }
            }
        }
    }
})()

readAttribute = function(element, name) {
    element = $(element);
    if (isIE) {
        var t = Element._attributeTranslations.read;
        if (t.values[name]) return t.values[name](element, name);
        if (t.names[name]) name = t.names[name];
        if (name.include(':')) {
            return (!element.attributes || !element.attributes[name]) ? null :
                element.attributes[name].value
        }
    }
    return element.getAttribute(name);
}

/**
 * Prototype认为 只要弄好IE就可以了
 */


// 写方法
Element._attributeTranslations.write = {
    names: Object.assign({
        cellpadding: 'cellPadding',
        cellspacing: 'cellSpacing'
    }, Element._attributeTranslations.read.names),
    values: {
        checked: function(element, value) {
            element.checked = !!value
        },
        style: function(element, value) {
            element.style.cssText = value ? value : ''
        }
    }
}

Element._attributeTranslations.has = {};

$w('colSpan rowSpan vAlign dateTime accessKey tabInde encType maxLength readOnly longDesc frameBorder').each(function(attr) {
    Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
    Element._attributeTranslations.has[attr.toLowerCase()] = attr;
})

writeAttribute = function(element, name, vlaue) {
    element = $(element);
    var attributes = {}, t = Element._attributeTranslations.write;
    if (typeof name === 'object') {
        attributes = name
    } else {
        attributes[name] = Object.isUndefined(value) ? true : value;
    }
    for (var attr in attributes) {
        name = t.names[attr] || attr;
        value = attributes[attr];
        if (t.valuess[attr]) t.values[attr](element, value);
        if (value === false || value === null) {
            element.removeAttribue(name)
        } else if (value === true) {
            element.setAttribute(name, name);
        } else {
            element.setAttribute(name, vlaue)
        }
        return element;
        
    }
}