function mix() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i++;
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
        target = {};
    }

    if (i == length) {
        target = this;
        i--;
    }
    for (; i < length; i++) {
        if (options = arguments[i] != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) continue;
                if (deep && copy && ((typeof copy == 'object') || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && (typeof src === 'object') ? src : {};
                    }
                    target[name] = mix(deep, clone, copy);
                } else if (copy != void 0) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

function mix() {
    var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;
    if (typeof target == 'boolean') {
        deep = target;
        target = arguments[1] || {};
        i++
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
        target = {};
    }
    if (i == length) {
        target = this;
        i--;
    }
    for(; i < length; i++) {
        if (options = arguments[i] != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (copy === src) continue;
                if (deep && copy && ((typeof copy == 'object') || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && typeof src == 'object' ? src : {};
                    }
                    target[name] = mix(deep, clone, copy);
                } else if (copy != void 0) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}