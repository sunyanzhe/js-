//Prototype.js
({
    classNames: function (element) {
        return new Element.ClassNames(element);
    },
    hasClassName: function(element, className) {
        if (!(element = $(element))) return;
        var elementClassName = element.className;
        return (elementClassName.length > 0 && (elementClassName === className || 
            new RegExp('(^|\\s)' + className + '(\\s|$)').test(elementClassName)))
    },
    addClassName: function(element, className) {
        if (!(element = $(element))) return;
        if (!Element.hasClassName(element, className)) 
            element.className += (element.className ? ' ' : '') + className
        return element;
    },
    removeClassName: function(element, className) {
        if (!(element = $(element))) return;
        element.className = element.className.replace(
            new RegExp('(^|\\s)' + className + '(\\s|$)'),
            ' '
        );
        return element
    },
    toggleClassName: function(element, className) {
        if (!(element = $(element))) return;
        return Element[Element.hasClassName(element, className) ? 
            'removeClassName' : 'addClassName'](element, className);    
    }
})

// 还可以精简一下

({
    getClass(el) {
        return el.className.replace(/\s+/, ' ').split(' ');
    },
    hasClass(el, cls) {
        return (' ' + el.className + ' ').indexOf(' ' + cls +' ')
    },
    addClass(el, cls) {
        if (!this.hasClass(el, cls))
            ele.className += ' ' + cls;
    },
    removeClass(el, cls) {
        if (this.hasClass(el, this)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            el.className.replace(reg, ' ')
        }
    },
    clearClass(el) {
        el.className = ''
    }
})

/**
 * avalon实现方案
 * 仿造classList
 */
var rnowhite = /\S+/g;
var fakeClassListMethods = {
    _toString() {
        var node = this.node,
            cls = node.className,
            str = typeof cls === 'string' ? cls : cls.baseVal,
            match = str.match(rnowhite);
        return match ? match.join(' ') : ''
    },
    _contains(cls) {
        return (' ' + this + ' ').indexOf(' ' + cls + ' ') > -1
    },
    _add(cls) {
        if (!this._contains(cls)) 
            this._set(this + ' ' + cls)
    },
    _remove(cls) {
        this._set((' ' + this + ' ').replace(' ' + cls + ' ', ' '))
    },
    __set(cls) {
        cls = cls.trim();
        var node = this.node;
        if (typeof node.className === 'object') {
            // SVG元素的className是一个对象SVGAnimatedString {baseVal = '', animaVal = ''},
            // 只能通过set/getAttribute操作
            node.setAttribute('class', cls)
        } else {
            node.className = cls;
        }
    }
}

function fakeCLassList(node) {
    if (!('classList' in node)) {
        node.classList = {
            node: node
        };
        for (var k in fakeClassListMethods) {
            node.classList[k.slice(1)] = fakeClassListMethods[k]
        }
    }
    return node.classList;
}

'add,remove'.replace(avalon.rword, function(method) {
    avalon.fn[method + 'Class'] = function(cls) {
        var el = this[0] || {};
        if (cls && typeof cls === 'string' && el.nodeType === 1) {
            cls.replace(rnowhite, function(c) {
                fakeCLassList(el)[method](c);
            })
        }
        return this;
    }
})

avalon.fn.mix({
    hasClass(cls) {
        var el = this[0] || {}
        return el.nodeType === 1 && fakeCLassList(el).contains(cls)
    },
    toggleClass(value, stateVal) {
        var isBool = typeof stateVal === 'boolean'
        var me = this
        String(value).replace(rnowhite, function(c) {
            var state = isBool ? stateVal : !me.hasClass(c);
            me[state ? 'addClass' : 'removeClass'](c)
        })
        return this
    }
})