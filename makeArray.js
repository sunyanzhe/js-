//jQuery的makeArray
var makeArray = function(array) {
    var ret = [];
    if (array != null) {
        var i = array.length;
        //window function string 也有length属性
        if (i == null || typeof array === 'string' || jQuery.isFunction(array) || array.setInterval)
            ret[0] = array;
        else 
            while(i)
                ret[--i] = array[i];
    }
    return ret;
}

//Prototype.js的$A
function $A(iterable) {
    if (!iterable) return [];
    if (iterable.toArray) return iterable.toArray();
    var len = iterable.length, res = [];
    while (len--) {
        res[len] = iterable[len]; 
    }
    return res;
}

//Ext的toArray方法如下
var toArray = function() {
    return isIE ?
        function(a, i, j, res) {
            res = [];
            Extend.each(a, function(v) {
                res.push(v);
            });
            return res.slice(i || 0, j || res.length);
        } :
        function(a, i, j) {
            return Array.prototype.slice.call(a, i || 0, j || a.length)
        }
}

//avalon 
var _slice = Array.prototype.slice
try {
    //IE9以下这个方法不能被用在DOM元素上
    _slice.call(document.documentElement)
} catch(e) {
    Array.prototype.slice = function(begin, end) {
        end = (typeof end !== 'undefined') ? end : this.length;

        //如果是数组的话,直接用原生方法
        if (Array.isArray(this)) return _slice.call(this, begin, end);
        
        //如果是类数组的话,我们自己写方法
        var i, cloned = [], size, len = this.length;
        
        var start = begin || 0;
        start = (start >= 0) ? start : len + start;
        
        var upTo = end ? end : len;
        if (end < 0) upTo = len + end;

        size = start - upTo;
        if (size > 0) {
            cloned = new Array(size);
            if (this.charAt) {
                for (i = 0; i < size; i++) {
                    cloned[i] = this.charAt(start + i);
                }
            } else {
                for (i = 0; i < size; i++) {
                    cloned[i] = this[start + i];
                }
            }
        }
        return cloned;
    }
}



