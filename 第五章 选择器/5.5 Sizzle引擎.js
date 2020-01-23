/**
 * jQuery最大的特点是其选择器, jQuery1.3时开始列装其Sizzle引擎
 * Sizzle引擎与胆识主流的引擎不大一样, 人们说他是从右到左选择(只能说大致如此),速度远胜当时的选择器
 * Sizzle 当时的几大特点如下
 * 1.允许以关系选择器开头
 * 2.允许取反选择器套取反选择器
 * 3.大量的自定义伪类, 比如位置(:eq, :first, :even...) 内容伪类(:contains) 包含伪类(:has) 标签伪类(:radio :input :text :file) 可见性伪类(:hidden, :visible)
 * 4.对结果进行去重, 以元素在DOM树的位置进行排序, 这样与未来出现的querySelector行为一直
 * 
 * Sizzle整体结果如下
 * 1.Sizzle主函数, 里面包含选择符的切割, 内部循环调用主查找函数, 主过滤函数, 最后是去重过滤
 * 2.其他辅助函数,如uniqueSort, matches, matchesSelector
 * 3.Sizzle.find主查找函数
 * 4.Sizzle.filter主过滤哈数
 * 5.Sizzle.selectors 包含各种匹配用的正则, 过滤用的正则 分解用过的正则 预处理函数 过滤函数
 * 6.根据浏览器的特征设计makeArray sortOrder contains等方法
 * 7.根据浏览器的特征重写Sizzle.selectors中的部分查找函数, 过滤函数, 查找次序
 * 8.若浏览器支持querySelectorAll, 那么用它重写Sizzle, 将原来的Sizzle作为后备方案包裹在新Sizzle里面
 * 9.其他辅助函数, 如isXML posProcess
 */

 //在jQuery1.8后, 加入tokenize(就是第一步提到选择复切割), 然后加入编译机制, 编译机制实际上就是根据我们切割好的字符的类型得到一大堆匹配函数
 //然后将他们转换为一个柯里化函数superMatcher, 然后再将这些字符作为传参来求值
 //上面的匹配函数就包括了jQuery1.7的主查找函数和主过滤函数

var Sizzle = function(selector, context, results, seed) {
    //通过短路运算符, 设置一些默认值
    results = results || [];
    context = context || document;
    
    //备份, 因为context会被改写, 如果出现并联选择器, 就无法区别当前节点是对应哪个context
    var origContext = context;

    //上下文对象必须是元素节点或文档对象
    if (context.nodeType !== 1 && context.nodeType !== 9) return [];

    //选择符必须是字符串, 且不能为空
    if (!selector || typeof selector !== 'string') return results;

    var m, set, checkSet, extra, ret, cur, pop, i,
        prune = true,
        contextXML = Sizzle.isXML(context),
        parts = [],
        soFar = selector;
    
    //下面是切割器的实现, 每次只处理到并联选择器, extra留给下次递归自身时作传参
    //不过与其他引擎的实现不同的是, 他没有一下子切成选择器, 而是切成选择器组与关系选择器的集合
    


}