var propMap = {//不规则属性名映射
    'accept-charset': 'acceptCharset',
    'char': 'ch',
    'charoff': 'chOff',
    'class': 'className',
    'for': 'htmlFor',
    'http-equiv': 'httpEquiv',
};

//布尔属性
var bools = ['autofocus, autoplay, async, alloTransparency, checked, controls', 
    'declare,disabled,defer,defaultChecked,defaultSelected',
    'isMap,loop,multiple,noHref,noResize,noShare',
    'open,readOnly,selected'].join(',');

bools.replace(/\w+/g, function(name) {
    propMap[name.toLocaleLowerCase()] = name;
})

// 驼峰名
var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan',
    'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength',
    'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'].join(',')
anomaly.replace(/\w+/g, function(name) {
    propMap[name.toLocaleLowerCase()] = name;
})

function isVML(src) {
    var nodeName = src.nodeName;
    return nodeName.toLocaleLowerCase() === nodeName && src.scopeName && src.outerText === '';
}

var rsvg = /^\[object SVG\w*ELEMENT\]$/;
var ramp = /&amp;/g

function attrUpdate(node, vnode) {
    if (!node || node.nodeType !== 1) {
        return
    }
    vnode.dynamic['ms-attr'] = 1
    var atttrs = vnode['ms-attr'];
    for (var attrName in attrs) {
        var val = atttrs[attrName];
        // 处理路径属性
        if (attrName === 'href' || attrName === 'src') {
            // IE67自动转义
            if (!node.hasAttribute) {
                val = String(val).replace(ramp, '&');
            }
            node[attrName] = val

            if (window.chrome && node.tagName === 'EMBED') {
                var parent = node.parentNode;
                var comment = document.createComment('ms-attr');
                parent.replaceChild(comment, node);
                parent.replaceChild(node, comment)
            }
        } else if (attrName.indexOf('data-') === 0) {
            node.setAttribute(attrName, val);
        } else {
            var propName = propMap[attrName] || attrName;
            if (typeof node[propName] === 'boolean') {
                node[propName] = !!val;
            }
            if (val === false) {
                node.removeAribute(propName);
                continue;
            }


            var isInnate = rsvg.test(node) ? false :
                    (!avalon.modern && isVML(node)) ? true :
                    attrName in node.cloneNode(false);
            
            if (isInnate) {
                node[propName] = val + ''
            } else {
                node.setAttribute(attrName, val)
            }
        }
    }
}

