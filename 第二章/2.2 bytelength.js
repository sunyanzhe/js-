function byteLen(target) {
    var len = target.length, i = 0;
    for (; i < target.length; i++) {
        if (target.charCodeAt(i) > 255) len++; 
    }
    return len;
}



function byteLen(str, charset) {
    let total = 0,
        charCode,
        i,
        len;
    charset = charset ? charset.toLowerCase() : '';
    if (charset === 'utf-16' || charset === 'utf16') {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0xffff) {
               total += 2;
            } else {
               total += 4;
            }
        }
    } else {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
    }
}


//truncate方法: 用于对字符串进行截断处理
function truncate(str, len, truncation) {
    len = len || 30;
    truncation = truncation === viod(0) ? '...' : truncation;
    return target.length > len ? 
        target.slice(0, len - truncation.length) + truncation :
        String(target);
}


//camelize方法
function camelize(str) {
    if (str.indexOf('-') < 0 && str.indexOf('_') < 0) {
        return str;
    }
    return str.replace(/[-_][^-_]/g, function(match){
        return match.charAt(1).toUpperCase()
    })
}

//underscored方法:转换为下划线
function underscored(str) {
    return target.replace(/[a-z\d][A-Z]/g, '$1_$2').replace(/\-/g, '_').toLowerCase()
}

//dasheize方法: 转换为连字符风格,即CSS变量的风格
function desherize(str) {
    return underscored(str).replace(/_/g, '-')
}

//首字母大写
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

//stripTags方法: 移除字符串中的html标签
function stripTags(str) {
    let reg = /<\w+(\s+("[^"]*"|'['^]*'|[^>])+)?>|<\/\w+>/ig;
    return String(target || "").replace(reg, '');
}


//stripScripts方法: 移除字符串中所有的script标签
function stripScripts(str) {
    return String(str || '').replace(/<script[^>]*>([\s\S]*?)<\/script>/img, '')
}


//esacpHTML:将字符串经过html转义得到合适在页面中展示的内容,如将'<'替换为'&lt;',此方法用于防止xss攻击
function esacpHTML(str) {
    return str.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
}

//pad方法:与trim方法相反, pad可以为字符串的某一端添加字符串,
//常见的方法如日历在月份前面补零,因此也别称之为fillZero

//1.数组法
function pad(target, n) {
    var zero = new Array(n).join('0');
    var str = zero + target;
    var result = str.substr(-n)
    return result
}

//2.版本1的变种
function pad(target, n) {
    return Array((n + 1) - target.toString().split('').length).join('0') + target
}

//3.Math.pow法
function pad(target, n) {
    return (Math.pow(10, n) + '' + target).slice(-n)
}

//4.二进制法, 思路同版本三
function pad(target, n) {
    return ((1 << n).toString(2) + target).slice(-n)
}

//format输入不同类型的参数

function format(str, obj) {
    var arr = Array.prototype.slice.call(arugments, 1)
    return str.replace(/\\?#\{([^\{\}]+)\}/gm, function(match, name) {
        if (match.charAt(0) == '\\') {
            return match.slice(1)
        }
        var index = Number(name)
        if (index >= 0) return arr[index];
        if (obj && obj[name] !== void 0) return obj[name];
        return '';
    });
}


//trim
function trim(str) {
    return str.repalce(/^\s\s*/, '').repalce(/\s\s*$/, '');
}

function trim(str) {
    var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\n\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    for (var i = 0; i < str.length; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    for (var i = str.length - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
