// 节点插入
function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
        parent.appendChild(newElement)
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling)
    }
}

/**
 * 除此之外,jQuery还提供了wrap, wrapAll, wrappInner这三种特殊的插入操作
 * wrap为当前元素提供了一个父节点,此父节点将动态插入原节点父级底下
 * wrapAll则是为一堆元素提供一个共同的父节点,插入到第一个元素的父节点底下,其他节点再统统挪到新节点底下
 * wrappInner是为当前元素插入一个新节点,然后将它之前的孩子挪到新节点底下
 * 
 */

if (!document.documentElement.applyElement && typeof HTMLElement !== 'undefined') {
    HTMLElement.prototype.removeNode = function(deep) {
        // deep参数决定是否只删除此节点,还是将其下级的所有子孙节点都一起删掉
        // 如果只删掉目标节点 那么其子孙全部挪到目标节点
        var parent = this.parentNode;
        var chidNodes = this.childNodes;
        var fragment = this.ownerDocument.createDocumentFragment();
        while (this.childNodes.length) {
            fragment.appendChild(childNodes[0]);
        }
        if (!!deep) {
            parent.removeChild(this)
        } else {
            parent.replaceChild(this, fragment)
        }
    return this;
    }
    HTMLElement.prototype.applyElement = function(newNode, where) {
        newNode = newNode.removeNode(false);
        var range = this.ownerDocument.createRange();
        var where = (where || 'outside').toLowerCase();
        var method = where === 'inside' ? 'selectNodeContents' :
            where === 'outside' ? 'selectNode' : 'error'
        if (method === 'error') {
            throw new Error('DOMException.NOT_SUPPORTED_ERR(9)')
        } else {
            range[method](this);
            range.surroundContents(newNode);
            range.detach()
        }
        return newNode
    }

}

// 可以模拟 wrap wrapInner效果