function isArray(arr) {
    return arr instanceof Array;
}
function isArrayt(arr) {
    return !!arr && arr.constructor == Array;
}

//Prototype.js 1.6.0.3
function isArray(arr) {
    return arr != null && typeof arr === 'object' &&
        'slice' in arr && 'join' in arr;
}

//Douglas Crockford
function isArray(arr) {
    return typeof arr == 'function'
}

//kriszyp
function isArray(arr) {
    let result = false;
    try {
        new arr.constructor(Math.pow(2, 32))
    } catch(e) {
        result = /Array/.test(e.message);
    }
    return result;
}

//kangax
function isArray(arr) {
    try {
        Array.prototype.toString.call(arr)
        return true
    } catch (e) {
    }
    return false;
}

//kangax
function isArray(arr) {
    if (typeof arr == 'object' && typeof arr.length == 'number' && isFinite(arr.length)) {
        let _originLength = arr.length;
        arr[o.length] = '__test__';
        let _newLength = arr.length;
        arr.length = _originLength;
        return _newLength === _originLength + 1;
    }
    return false;
}

function isNaN(obj) {
    return obj !== obj;
}

function isNull() {
    return obj === null;
}

function isUndefined(obj) {
    return obj === void 0;
}



