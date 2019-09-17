//数值没有什么好扩展的, 而且javascript的数值精度的问题未修复,要修复他们可不是一两行代码了事
//先看拓展,我们只能把目光集中于Prototype.js与mootools就行了
/*
    Prototype.js为它添加了8个原型方法
    1.Succ是加1
    2.times是将回调重复执行指定次数
    3.toPaddingString与上面提到字符串拓展方法pad作用一样
    4.toColorPart是转十六进制
    abs ceil发floor是从Math中偷来的

    mootools的情况
    1.limit是从数值限定在一个闭开间中,如果大于或者小于其边间,则等于最大值或最小值
    2.times与Prototype中的用法相似
    3.round是Math.round的增强版,添加的精度控制
    4.toFloat, toInt是从window偷来的
    其他的则是从Math偷来的
*/

//在ES5_shim.js库中, 他实现了ECMA262V5提到的一个内部方法toInteger
function toInteger(n) {
    n = +n;
    if (n !== n) {  //isNaN
        n = 0;
    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {    //n不是正无穷 负无穷
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

//limit方法: 确保数值在[n1, n2]的闭区间内,如果超出限界,则置换为离它最近的最大值或最小值
function limit(target, n1, n2) {
    var a = [n1, n2].sort((a, b) => a - b);
    if (target < a[0]) target = a[0];
    if (target > a[1]) target = a[1];
    return target;
}

//nearer: 方法求出距离指定数值最近的数
function nearer(target, n1, n2) {
    let diff1 = Math.abs(target - n1),
        diff2 = Math.abs(target - n2);
    return diff1 < diff2 ? n1 : n2;
}

//Number下唯一需要修复的方法是toFixed,他是用于校正精确度,最后的数会做四舍五入操作
//但在一些浏览器中并没有这么干
if (0.9.toFixed() !== '1') {
    Number.prototype.toFixed = function(n) {
        var power = Math.pow(10, n);
        var fixed = (Math.round(this * power) / power).toString();
        if (n == 0) return fixed;
        if (fixed.indexOf('.') < 0) fixed += '.';
        var padding = n + 1 - (fixed.length - fixed.indexOf('.'));
        for (var i = 0; i < padding; i++) fixed += '0';
        return fixed;
    }
}

//在javascript中 数值有3种保存方式
//1.字符串形式的数值内容
//2.IEEE754标准双精度浮点数, 他最多支持小数点后带15 - 17位小数, 由于存在二进制和十进制的转换问题, 具体的位数会发生变化
//3.一种类似于C语言的int类型的32位整数,它由4个8bit的字节构成,可以保存较小的整数

//当JavaScript遇到一个数值时,他会首先尝试按整数来处理该数值,如果行得通,则把数值保存为31bit的整数
//如果该数值不能视为整数,或超出31but的范围,则把数值保存为64位的IEEE754浮点数

