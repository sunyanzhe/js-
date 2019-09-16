Array.prototype.reduce = function(fn, lastResult, scope) {
    if (this.length == 0) return lastResult;
    var i = lastResult !== undefined ? 0 : 1;
    var result = lastResult !== undefined ? lastResult : this[0];
    for (var len = this.length; i < len; i++) {
        result = fn.call(scope, result, this[i], i, this)
    }
    return result;
}

//contains方法: 判定数组中是否包含指定目标
function contains(target, item) {
    return target.indexOf(item) > -1
}

//removeAt方法: 移除数组中指定位置的元素, 返回布尔值成功与否
function removeAt(target, index) {
    return !!target.splice(index, 1).length;
}

//remove方法: 移除数组中第一个匹配传参的那个元素,返回布尔值表示成功与否
function remove(target, item) {
    let index = target.indexOf(item);
    if (~index) return removeAt(target, index)
    return false;
}

//shuffle方法: 对数组进行洗牌
function shuffle(target) {
    var j, i = target.length;
    while (i > 0) {
        j = Math.floor(Math.random() * i)
        i--;
        [target[i], target[j]] = [target[j], target[i]]
    }
    return target;
}

//random方法: 从数组中随机抽选一个元素出来
function random(target) {
    return target[Math.floor(Math.random() * target.length)]
}

//flatten方法: 对数组进行扁平化处理
function flatten(target) {
    var result = [];
    target.forEach(item => {
        if (Array.isArray(item)) {
            result = result.concat(flatten(item))
        } else {
            result.push(item)
        }
    })
    return result
}

//unique方法: 去重
function unique(target) {
    var result = [];
    loop: for (var i = 0, n = target.length; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
            if (target[j] === target[i]) continue loop;
        }
        result.push(target[i]);
    }
    return result;
}

//compact方法: 过滤数组中的null和undefined
function compact(target) {
    return target.filter(item => item != null);
}

//union方法: 对两个数组取并集
function union(target, array) {
    return unique([...target, ...array])
}

//intersect方法: 对两个数组取交集
function intersect(target, array) {
    return target.filter(item => {
        return ~array.indexOf(item)
    })
}

//diff方法: 对两个数组取差集
function diff(target, array) {
    let result = target.slice();
    for (let i = 0, len = result.length; i < len; i++) {
        for (let j = 0, length = array.length; j < length; j++) {
            if (result[i] === array[j]) {
                result.splice(i, 1);
                i--;
                break
            }
        }
    }
    return result;
}

//min方法: 获取数组最小值
function min(target) {
    return Math.min.apply(null, target)
}

//max方法: 获取最大值
function max(target) {
    return Math.max.apply(null, target);
}

//splice修复方法
Array.prototype.splice = function(s, d) {
    let max = Math.max,                     //取最大值
        min = Math.min,                     //取最小值
        a = [],                             //最后删除的值
        i = max(arguments.length - 2, 0),   //要增加的值
        l = this.length,                    //数组的长度
        k = 0,
        e,                                  //工具人
        n,                                  //最后数组的长度
        v,                                  //完成数组长度与原数组长度的差
        x;                                  //原数组没操作的值得最开始的索引
    s = s || 0;
    if (s < 0) s += l;                      //如果是负数, 就加个length
    s = max(min(s, l), 0);
    d = max(min(typeof d == 'number' ? d : l, l - s), 0);

    v = i - d;                              //完成数组长度的原数组长度差
    n = l + v;                              //完成数组长度
    
    while (k < d) {
        e = this[s + k];                    
        if (e !== void 0) {
            a[k] = e;                       //把要删除的值放到a数组//把要删除的值放到a数组
        }
        k++;
    }

    x = l - s - d;                          //剩下的没有被操作的数组的个数

    if (v < 0) {                            //如果操作的数组要比原来的数组短
        k = s + i;
        while (x) {
            this[k] = this[k - v];          //留出要加进度的值的位置,然后把后面的值提到前面来
            k++;
            x--;
        }
        this.length = n;
    } else if (v > 0) {                     //如果操作的数组比原来的数组长
        k = 1;
        while (x) {
            this[n - k] = this[l - k];      //先给数组增加长度,从后往前将操作的数组和原数组倒着一个一个做对应
            k++;
            x--;
        }
    }
    
    for (k = 0; k < i; k++) {
        this[s + k] = arguments[k + 2];     //将剩余空出来的位置用参数里的值添加满
    }
    return a;
}


//数组的空位
//数组的空位是指数组的某一个位置没有任何值, Array的构造函数返回的数组都是空位
let arr = new Array(3);         //[ , , ,]

//上面的代码中, Array(3)返回一个具有3个空位的数组
//空位不是undefined,而是这个位置什么值都没有

//ES5对空位的处理, 不一致,大多数情况下都是忽略空位
// 比如forEach()、filter()、every()和some()都会跳过空位; map()会跳过空位,但是会保留这个值
//join()和toString()将空位视为undefined, 而undefined和null会被处理成空字符串

console.log([,'a',undefined,null].join('#'));       //#a##
console.log([,'a',undefined,null].toString());      //,a,,

//ES6则是明确将空位转为undefined.
//比如, Array.from方法会将数组的空位转为undefined,也就是说,这个方法不会忽略空位

console.log(Array.from(['a',,'b']))             //['a', undefined, 'b']

//扩展元素安抚