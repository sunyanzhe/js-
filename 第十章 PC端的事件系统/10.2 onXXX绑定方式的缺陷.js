/**
 * onXXX既可以写在HTML标签内, 也可以独立出来, 作为元素节点的一个特殊属性来处理
 * 不过作为一个古老的绑定方式, 他很难预测到后来人对这方面的发展
 * 
 * 总结下来有以下不足
 * 1. 对DOM3新增事件或FF某些私有实现无法支持, 主要有以下事件
 *  DOMActivate
 *  DOMAttrModified
 *  DOMAttributeNameChanged
 *  DOMCharacterDataModified
 *  DOMContentLoaded
 *  DOMElementNameChanged
 *  DOMFocusIn
 *  DOMFocusOut
 *  DOMMouseScroll
 *  DOMNodeInserted
 *  DOMNodeInsertedIntoDocument
 *  DOMNodeRemoved
 *  DOMNodeRemovedFromDocument
 *  DOMSubtreeModified
 *  MozMousePixelScroll
 *  
 * 上面能用到的基本就是 DOMContentLoaded与DOMMouseScroll
 * DOMContentLoaded用于检测DomReady DOMMouseScroll用于在FF模拟其他浏览器的mousewheel事件
 * 
 * 2. 只允许元素每次绑定一个回调, 重复绑定会冲掉之前的绑定
 * 3. 在IE下回调没有参数, 在其他浏览器年回调的第一个参数是事件对象
 * 4. 只能在冒泡阶段可用
 */
