/**
 * 这是浏览器一组非常重要的属性, 因此光是浏览器本身提供了多个方法来修改他们,
 * 比如挂载window下的scroll scrollTo scrollBy方法以及挂载元素下的scrollLEft scrollTop scrollIntoView
 * jQuery在css模块就提供了scrollTop scrollLeft来修改或读取元素或窗口的滚动坐标
 * 
 * 元素上的读写没什么问题, 关键是window上的
 * 设置时, 我们使用scrollTo方法
 * 读取时, 我们是用pageXoffset pageYoffset
 */
avalon.each({
    scrollLeft: 'pageXOffset',
    scrollTop: 'pageYOffset'
}, function(method, prop) {
    avalon.fn[method] = function(val) {
        var node = this[0] || {}, 
            win = getWindow(node),
            top = method === 'scrollTop';
        if (!arguments.length) {
            return win ? (prop in win) ? win[prop] : root[method] : node[method]
        } else {
            if (win) {
                win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
            } else {
                node[method] = val;
            }
        }
    }
})

function getWindow(node) {
    return node.winow && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false
}