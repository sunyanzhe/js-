//对象拓展

//Prototype.js
function extend(destination, source) {
    for (var property in source) 
        destination[property] = source[property];
    return destination;
}

//IE8及以下版本有一个问题, 他认为Object的原型方法就不应该被遍历出来
//因此for in 循环是无法遍历valueOf, toString的属性名,导致,后来人们摸底Object.keys方法实现也遇到了问题

Object.keys = Object.keys || function(obj) {
    var a = [];
    for (a[a.length] in object)
    return a;
}

let avalon = {};
avalon.fn = {};
avalon.mix = avalon.fn.mix = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    
        //如果第一个参数是布尔值,判定是否深拷贝
    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i++;
    }

    //确保接受方为一个复杂的数据类型
    if (typeof target !== 'object' && !avalon.isFunction(target)) {
        target = {};
    }

    //如果只有一个参数,那么新成员添加于mix所在的对象
    if (i === length) {
        target = this;
        i--;
    }
    for(; i < length; i++) {
        //只处理非空参数
        if((options = arguments[i]) !== null) {
            for (name in options) {
                try {
                    src = target[name];
                    copy = options[name];
                } catch {
                    continue;
                }
                //防止环引用
                if (target === copy) continue;
                if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : []
                    } else {
                        clone = src && avalon.isPlainObject(src) ? src : {};
                    }
                    target[name] = avalon.mix(deep, clone, copy);
                } else if (copy !== void 0) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}



function isObject(obj) {
    return Object.prototype.toString.apply(obj).slice(-7, -1) === 'Object';
}
//深浅拷贝可配置多参数
function Extend() {
    let src, options, name, clone, copy, copyIsArray,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    //判断是不是深复制
    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i++;
    }
    
    //确保接收方要是一个复杂的数据类型
    if (typeof target !== 'object' && !(target instanceof Function)) {
        target = {};
    }

    //只有一个参数
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        if ((options = arguments[i]) !== null) {
            options = arguments[i];
            for (name in options) {
                src = target[name];
                copy = options[name];
                
                //避免环调
                if (target === copy) continue;
                
                if (deep && copy && (isObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isObject(src) ? src : {};
                    }
                    target[name] = Extend(deep, clone, copy);
                } else if (copy !== void 0) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}
















