/**
 * jQuery的缓存系统是吧所有数据都放在$.cache仓库上,然后为每个要使用缓存系统的元素节点,文档对象与window对象都分配一个UUID
 * UUID的属性名为一个随机的自定义属性, 'jQuery'+new Date().getTime()值为证整数,从零递归
 * 但UUID总要附于一个对象上,如果那个对象是window,就会全局污染,所以jQuery内部判定它是window对象时,映射为一个叫windowData的空对象,UUID附在它之上
 * 有了UUID,我们再首次访问缓存系统时,会在$.cache对象开辟一个空对象(缓存体),用于放置与目标对象有关的东西.
 * 这有点像银行开户,UUID的值就是'存折'. removeData则会删掉不再需要保存数据, 如果到最后,数据删光了,它也没有任何键值对应,则会变为空对象,jQuery就会从$.cache中删除此对象,并从目标对象移除UUID
 */
var expando = 'jQuery' + (new Date()).getTime(), uuid = 0, windowData = {};
jQuery.extend({
    cache: {},
    data: function(elem, name, data) {
        elem = elem == window ? windowData : elem;
        var id = elem[expando];
        if (!id) id = elem[expando] = ++uuid;
        if (name && !jQuery.cache[id]) 
            jQuery.cache[id] = {}
        if (data != undefined)
            jQuery.cache[id][name] = data;
        return name ? jQuery.cache[id][name] : id;
    },
    removeData: function(elem, name) {
        elem = elem == window ? windowData : elem;
        var id = elem[expando];
        if (name) { // 移除目标数据
            if (jQuery.cache[id]) {
                delete jQuery.cache[id][name];
                name = ''
                for (name in jQuery.cache[id])
                    break;
                if (!name)
                    jQuery.removeData(elem)
            }
        } else {
            try {
                delete elem[expando];
            } catch (error) {
                if (elem.removeAttribute)
                    elem.removeAttribute(expando);
            }
            delete jQuery.cache[id];
        }
    }
})

/**
 * jQuery在1.3中, 数据缓存系统终于独立成一个模块data.js, 并添加了两组方法,分别是命名空间上的queue与dequeue
 * queue的目的很明显,就是缓存一组数据, 为动画模块服务. dequeue是从一组数据中删掉一个
 */
jQuery.extend({
    queue: function(elem, type, data) {
        if (elem) {
            type = (type || 'fx') + 'queue';
            var q = jQuery.data(elem, type);
            if (!q || jQuery.isArray(data))
                q = jQuery.data(elem, type, jQuery.makeArray(data))
            else if (data)
                q.push(data)
            return q
        }
    },
    dequeue: function(elem, type, data) {
        var queue = jQuery.queue(elem, type);
        fn = queue.shift();         // 然后删掉一个, 早期它是放置动画的回调, 删掉它就会调用一下
        if (!type || type === 'fx') {
            fn = queue[0]
        } 
        if (fn !== undefined) {
            fn.call(elem);
        }
    }
})

/**
 * 在元素上添加自定义属性,还会引发一个问题
 * 如果我们对这个元素进行拷贝,就会将此属性也复制过去
 * 导致两个元素有相同的uuid,出现数据操作错误的情况
 * jQuery早期的复制节点实现非常简单, 如果元素的cloneNode方法不会复制事件, 就是用cloneNode
 * 否则使用元素的outerHTML或父节点的innerHTML,用clean方法解析一个元素出来.
 * 但outerHTML与innerHTML都会将属性写在里面,因此需要用正则把他们清除掉
 */

var ret = this.map(function() {
    if (!jQuery.support.noCloneEvent && !jQuery.ixXMLDoc(this)) {
        var html = this.outerHTML;
        if (!html) {
            var div = this.ownerDocument.createElement('div');
            div.appendChild(this.cloneNode(true));
            html = div.innerHTML;
        }
        return jQuery.clean([html.replace(/ jQuery\d+="(?:\d+|null)"/g, '').replace(/^\s*/, '')])[0]
    } else {
        return this.cloneNode(true)
    }
})

/**
 * 在jQuery 1.4中, 我们发现它对object、embed、applet这3种元素进行了特殊处理，缘由这3个元素时用于加载外部资源的
 * 比如flash、silverlight、media play、realone player、window自带的日历组件、颜色选择器等。
 * 在旧IE中，元素节点只是COM的包装，一旦引入这些资源后，它就会变成那种资源的实例
 * 一旦这资源是由VB等语言写的，由于VM有严格的访问控制，不能随便给对象添加新属性与方法，就会遇到抛错的可能
 * 因此jQuery做出一个决定，对于这3中元素，就不会它们缓存数据
 * jQuery在内部弄了一个叫noData的对象，专门放置它们的tagName
 */
noData = {
   embed: true,
   object: true,
   applet: true
}
  
  // 代码防御
if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
    return;
}
 
/**
 * HTML5对人们随便添加自定义属性的行为做出回应, 新增一种叫data-*的缓存机制.
 * 当用户设置的属性以data-开头, 它们会被保存到元素节点的dataset对象上.
 * 于是jQuery团队又有了一个主意,允许人们通过data-*配置UI组件, 于是他们对data-*进行了如下加强
 * 当用户第一次访问此元素节点, 会遍历它所有data-开头的自定义属性,  把它们放到jQuery的缓存体中.
 * 那么当用户取数据时,会先从缓存系统中获取, 没有再使用setAttribute访问data-自定义属性
 * 但HTML5的缓存系统非常弱, 只能保存字符串(为了避免循环引用), 于是jQuery将他们还原为各种数据类型
 * 如 'null' 'false' 'true'变成null false true 符合数字格式的字符串会转换成数字,如果是{}就尝试转成一个对象
 */
rbarce = /^(?:\{.*\}|\[.*\])$/;
if (data === undefined && this.length) {
    data = jQuery.data(this[0], key);
    if (data === undefined && this[0].nodeType === 1) {
        data = this[0].getAttribute('data-' + key);
        if (typeof data === 'string' ) {
            try {
                data = data === "true" ? true :
                    data === "false" ? false :
                    data === "null" ? null :
                    !jQuery.isNaN(data) ? parseFloat(data) :
                    rbarce.test(data) ? jQuery.parseJSON(data) :
                    data;
            } catch(e) {}
        } else {
            data = undefined;
        }
    }
}

/**
 * jQuery的数据缓缓存系统本来是为事件系统服务而分化出来的,到后来,它是内部众多模块的基础设施
 * 换言之,它是为框架内部自己使用的, 但一旦它公开到文档中,不可避免地,用户会使用data方法来保存它们来工作业务中用到的数据
 * 因此, 这两类数据可能就有相互覆盖的危险.
 * 私有数据(框架使用的)和用户数据(用户使用的), 你不能设置一个优先级来阻止他们的互相覆盖,因为没有阻止私有数据,可能导致框架的部分功能无法运作
 * 比如事件系统在每个元素的缓存体上设置的events对象,
 * 而你让用户设置的数据莫名其妙不能生效,这也是无法让人接受的.
 * 因此早期jQuery作出的让步是, 框架使用的私有数据的属性名会尽可能的生僻复杂,尽量减少重名的可能.
 * 比如__class__ __change__ _submit_attached _change_attached
 */

 /**
  * jQuery1.5对缓存体进行改造, 原本就是一个对象, 现在什么数据都往里面抛, 它就在这个缓存体内开辟了一个子对象,键名为随机的jQuery.expando值, 如果是私有数据就存到里面去
  * 但events私有数据为了向前兼容起见, 还是直接放到缓存体之上.
  * 至于, 如何区分私有数据,非常简单, 直接在data方法添加第四个参数, 真值是私有数据, removeData时也相应提供第三个参数, 用于删除私有数据.
  * 还新设了一个_data方法,专门用于操作私有数据
  */

/**
 * jQuery1.7 对缓存体做了改进, 系统变量便放置在data对象中, 为此判定缓存体为空也要做相应的改进
 * 现在要跳过toJSON与data, 新结构如下
 */
var cache = {
    data: {/**放置用户数据 */},
    /**这里放置私有数据 */
}

jQuery = {
    cache: {},
    expando: 'jQuery' + (new Date()).getTime(),
    noData: {
        applet: true,
        embed: true,
        object: true
    },
    _data() {},
    _removeData() {},
    acceptData() {},
    data() {},
    hasData() {},
    removeData() {},
    prototype: {
        data() {},
        removeData() {}
    }
}
