//contains方法: 判定一个字符串是否包含另一个字符串

function contains(target, it) {
    return target.indexOf(it) != -1;
}

function contains2(target, it, separator) {
    return separator ?
            (separator + target + separator).indexOf(separator + it + separator) > -1 :
            target.indexOf(it);
}

//startsWith方法: 判定目标字符串是否位于原字符串的开始之处
function startsWith(target, str, ignorecase) {
    let start_str = target.substr(0, str.length);
    return ignorecase ? start_str.toLowerCase() === str.toLowerCase() : 
        start_str === str;
}

//endsWith: 与startsWith相反
function endsWith(target, str, ignorecase) {
    let end_str = target.substring(target.length - str.length);
    return ignorecase ? start_str.toLowerCase() === str.toLowerCase() : 
        start_str === str; 
}

//repeat: 讲一个字符串重复自身N次
function repeat(target, n) {
    return (new Array(n + 1)).join(target);
}

function repeat(target, n) {
    return Array.prototype.join.call({
        length: n + 1
    }, target);
}

var repeat = (function() {
    var join = Array.prototype.join, obj = {};
    return function(target, n) {
        obj.length = n + 1;
        return join.call(obj, target);
    }
})()

function repeat(target, n) {
    let s = target, total = [];
    while (n > 0) {
        if (n % 2 == 1) total[total.length] = s;
        if (n == 1) break;
        s += s;
        n = n >> 1;
    }
    return total.join('');
}

function repeat(target, n) {
    let s = target, c = target.length * n;
    do {
        s += s;
    } while (n = n >> 1)
    return s.substring(0, c);
}

function repeat(target, n) {
    let s = target, total = '';
    while (n > 0) {
        if (n % 2 == 1) total += s;
        if (n == 1) break;
        s += s;
        n = n >> 1;
    }
}

