/**
 * 样式模块大致分为两大块, 精确获取样式值与设置样式
 * 由于样式分为外部样式, 内部样式与行内样式,再加上important对选择器的权重干扰,
 * 实际上很难看到元素时引用了哪些样式规则
 * 因此样式模块, 80%的比重在于获取
 */

/**
 * 大体上, 我们再标准浏览器下是使用getComputedStyle, IE6 - IE8下使用currentStyle来获取元素的精确样式
 * 不过getComputedStyle并不挂在元素上, 而是window的一个API, 他返回一个对象, 可以选择使用getPropertyValue方法传入连字符风格的样式名,获取值
 * 或者属性法+驼峰风格的样式名去取值, 但考虑到currentStyle也是使用属性法+驼峰风格 我们统一使用后者
 */
var getStyle = function(el, name) {
    if (el.style) {
        name = name.replace(/\-(\w)/g, function(all, letter) {
            return letter.toUpperCase();
        })
        if (window.getComputedStyle) {
            // getComputedStyle的第二个参数是针对伪类的 如滚动条, placeholder
            // 但IE9不支持, 因此只管元素节点, 上面的el.style过滤掉了
            return el.ownerDocument.getComputedStyle(el, null)[name];
        } else {
            return el.currentStyle[name];
        }
    }
}
// 设置样式则更没有难度, 直接el.style[name] = value
/**
 * 但是框架考虑的东西很多, 如兼容性, 易用性, 拓展性
 * 1.样式名要支持连字符风格,与驼峰风格
 * 2.样式名要进行必要的处理, 如float样式与CSS3带私有前缀的样式
 * 3.设置样式时, 对于长度宽度可以考虑直接处理数值, 与框架只能补上px单位
 * 4.对个别样式的特殊处理, 如IE下的z-index opacity use-select background-position top left
 */