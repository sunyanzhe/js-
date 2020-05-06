/**
 * 在移动端很多事件都是使用这两种事件合成出来的
 * 触摸事件会在用户手指放在屏幕上面时, 在屏幕上滑动时或从屏幕上移开时触发
 * 具体来说有以下触摸事件
 * 
 * 1. touchstart 一根或多根手指开始触摸屏幕时触发
 * 2. touchmove 一根或多根手指在怕屏幕上移动时触发, 在这个事件发生期间, 调用preventDefault可阻止滚动和选中文字
 * 3. touchend 当手指从屏幕上移开时触发
 * 4. touchcancel 触摸意外取消时触发, 一直长安不动, 手指划出屏幕 或过程中打入电话
 * 
 * 上面的事件都可以冒泡, 也都可以取消, 提供了鼠标事件中常见的属性: bubbles cacelable view deail altKey shiftKey ctrlKey metaKey
 * 
 * 
 * 
 * 除此之外还有一个Touch对象, 在event的属性上touches targetTouches changeTouches均可以访问到
 * 1. touches: 当前屏幕上所有触摸点列表
 * 2. targetTouches: 绑定事件的元素节点或对象上的所有触摸点列表
 * 3. changeTouches: 绑定事件的元素节点或对象上发生了改变的触摸点列表
 * 
 * 
 * 
 * 每个Touch对象包含下列属性
 * 1. ClinetX 触摸目标在视口中的x坐标
 * 2. clientY 触摸目标在视口中的y坐标
 * 3. identifier 表示触摸的唯一ID
 * 4. pageX 触摸目标在页面中的x坐标
 * 5. pageY 触摸目标在页面中的y坐标
 * 6. screenX 触摸目标在页面中的x坐标
 * 7. screenY 触摸目标在页面中的y坐标
 * 8. target 触摸的DOM节点
 * 
 * 值得注意的是, 如果我们想获取触摸点的信息, 最好一直使用changeTouches, 并且在touchend事件中touches及targetTouches的长度为零
 * 
 * 
 * 
 * 从行为上来看, touch事件与鼠标事件非常相似, 当我们点击某一个元素时, 它们几乎都会同时发生, 其执行顺序如下
 * touchstart
 * mouseover
 * mousemove
 * mousedown
 * mouseup
 * click
 * touched
 * 
 * 
 * 顺序不一定对的, 移动端的兼容性问题比IE6更让人头痛, 我们只能保证touchstart mousedown mouseup click这4个顺序
 * 其实不支持touch事件的浏览器只有winphone下的IE而已, 
 * 
 * 标准事件名           touchstart          touchmove           touchend            touchcancel
 * IE9-10               MSPointerDown       MSPointerMove       MSPointerUp         MSPointerCancel
 * IE11                 pointerdown         pointermove         pointerup           pointercancel
 * 模拟事件             mousedown           mousemove           mouseup
 */

 
