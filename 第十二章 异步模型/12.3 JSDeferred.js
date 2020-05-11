/**
 * JSDeferred的特点
 * 1. 内部通过单向链表结果存储成功事件处理函数, 失败事件处理函数和链表中下一个Deferred类型对象
 * 2. Deferred实例内部没有状态标识 也就是说 Deferred实例没有自定义的生命周期
 * 3. 由于Deferred实例没有状态标识,因此不支持成功/失败事件处理函数的晚绑定
 * 4. Deferred实例的成功/失败时间是基于事件本身的触发而被调用的
 * 5. 由于Deferred实例没有状态标识, 因此成功/失败时间可被多次触发, 也不存在不变值作为事件处理函数入参的说法
 */

/**
 * Promise/A的特点
 * 1. 内部通过单项链表结果存储成功事件处理函数, 失败事件处理函数和链表中下一个Promise类型对象
 * 2. Promise内部有状态表示: pending(初始状态) fulfilled(成功状态) rejected(失败状态), 且状态为单方向移动(pending -> fulfilled) (pending -> rejected)
 *     也就是Promise实例存在生命周期, 而生命周期的每个阶段具备不同的事件和操作
 * 3. 由于Promise实例含状态标识, 因此支持事件处理函数的晚绑定
 * 4. Promise实例的成功/失败事件函数基于Promise的状态而被调用
 */


// 核心区别
/**
 * Promise的调用流程
 * 1. 调用resolve/reject方法尝试改变Promise状态, 若成功改变其状态, 则调用Promise当前状态相应的事件处理函数
 * 2. 通过then方法进行事件绑定, 若Promise实例的状态不是pending, 则调用Promise当前状态相应的事件处理函数
 * 
 * JSDeferred调用成功/失败事件流程
 * 调用call/fail方法触发成功/失败事件, 则调用相应的事件处理函数
 * 因此jsDeferred是基于事件的
 */