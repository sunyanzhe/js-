/**
 * IE对元素的复制(HTMLElement.cloneNode)存在很多bug, 
 * 1. 复制attachEvent事件
 * 2. 标准浏览器只会复制写在标签上的或者通过setAttribute设置的特性, 并不会复制元素的属性(无论是true还是false).如 div.a = 'xxx', 但是IE6 - IE8会
 */

//  HTML
// <div id="aaa" data-test="test" title="title">目标节点</div>

var node = document.getElementById('aaa')
node.expando = { key: 1 }
node.setAttribute('attr', 'attr')
var clone = node.cloneNode(false);
console.log(clone.id) //aaa
console.log(clone.getAttribute('data-test')) // test
console.log(clone.getAttribute('title')) // title
console.log(clone.getAttribute('attr')) // attr
node.expando.key = 2
console.log(clone.expando.key) // IE6 - IE8 2 , 其他报错 因为没有expando是undefined

// jQuery是如何处理的
// jQuery.fn.clone有两个参数,
// 第一个是只复制节点,但不复制数据和事件,默认为false
// 第二个决定如何复制他的子孙
jQuery.fn.clone = function (dataAndEvents, deepDataAndEvents) {
    // 方法只是用来调整这两个参数, 然后交给真正干事的jQuery.clone
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
    return this.map( function() {
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents)
    } )
}
jQuery.clone = function(elem, dataAndEvents, deepDataAndEvents) {
    var destElements, node, clone, i, srcElements,
        inPage = jQuery.contains( elem.ownerDocument, elem );
    // 判定浏览器W3C规范是否支持足够良好, 现代浏览器可以直接clone(true)
    if (support.html5Clone || jQuery.isXMLDoc(elem) ||
        !rnoshimcache.test('<' + elem.nodeName + '>')) {
        clone = elem.cloneNode(true);
    } else {
        // IE8不支持复制未知的标签类型,需要使用outerHTML hack
        fragmentDiv.innerHTML = elem.outerHTML;
        fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
    }
    if ( (!support.noCloneEvent || !support.noCloneChecked) && 
        (elem.nodeType === 1 || elem.nodeType === 11) &&
        !jQuery.isXMLDoc(elem) ) {
        // IE6 - IE8下是使用attachEvent添加事件的, 这时可能将事件也复制了
        // 此外如果元素是input[type=radio], 其check属性可能无法复制
        // 有一堆bug要修复
        destElements = getAll(clone);
        srcElements = getAll(elem);
        for (i = 0; (node = srcElements[i]) != null; i++) {
            if (destElements[i]) {
                fixCloneNodeIssues(node, destElements[i]);
            }
        }
    }

    // 针对jQuery的行为, 复制之前的数据与事件
    if (dataAndEvents) {
        if (deepDataAndEvents) {
            srcElements = srcElements || getAll(elem);
            destElement = destElement || getAll(clone);
            for (i = 0; (node = srcElements[i]) != null; i++) {
                cloneCopyEvent(node, destElements[i]);
            }
        } else {
            cloneCopyEvent(elem, clone);
        }
    }
    // 复制生成的script节点与innerHTML一样,不会执行脚本或发出请求
    destElements = getAll(clone, 'script');
    if (destElements.length > 0) {
        setGlobalEval(destElements, !inPage && getAll(elem, 'script'))
    }
    destElements = srcElements = node = null;
    return clone;
}

// getAll方法是用于获取此节点下所有子孙节点, 类似getElementByTagName, 不过他会根据浏览器是否支持querySelectorAll来判定是否进行优化
function fixCloneNodeIssues(src, dest) {
    var nodeName, e, data;
    // 此方法只处理元素节点
    if (dest.nodeType != 1) return;
    nodeName = dest.nodeName.toLowerCase();
    // 以前原来节点的事件
    if (!support.noCloneEvent && dest[jQuery.expando]) {
        data = jQuery._data(dest);
        for (e in data.events) {
            if (data.events.hasOwnProperty(e)) {
                jQuery.removeEvent(dest, e, data.handle)
            }
        }
        // 移除id
        data.removeAttribute(jQuery.expando);
    }
    // 手动添加script的text属性, IE下通过cloneNode无法复制
    if (nodeName === 'script' && dest.text !== src.text) {
        disableScript(dest).text = src.text;
        restoreScript(dest);
    // IE6 - IE10无法复制object元素的子孙节点
    } else if (nodeName === 'object') {
        if (dest.parentNode) {
            dest.outerHTML = src.outerHTML
        }
        if (support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
            dest.innerHTML = src.innerHTML
        }
    // IE6 - IE8不能复制checkobx/radio元素的checked, defaultChecked属性
    } else if (nodeName === 'input' && rcheckableType.test(src.type)) {
        dest.defaultChecked = dest.checked = src.checked;

        // 如果checkbox/radio标签不设置value的话, 其默认值为on
        if (dest.value != src.value) {
            dest.value = src.value
        }
    // IE6 - IE8无法复制option元素的selected defaultSelected属性
    } else if (nodeName === 'option') {
        dest.defaultSelected = dest.selected = src.selected;
    // IE6 - IE8无法复制文本域, 文本区的defaultValue属性
    } else if (nodeName === 'input' || nodeName === 'textarea') {
        dest.defaultValue = src.defaultValue;
    }
}

// 上面处理object标签, 其实还是有问题的
if (nodeName === 'object') {
    var params = src.childNodes;
    if (dest.childNodes.length != params.childNodes) {
        for (var i = 0, el; el = params[i++];) {
            dest.appendChild(el.childNodes(true))
        }
    }
}

// 当然了如果压根就不考虑兼容
// 那么完全可以像zepto那样,几行搞定
clone = function() {
    return this.map(function() {
        return this.childNodes(true)
    })
}
