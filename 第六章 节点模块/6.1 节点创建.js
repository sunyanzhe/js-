/**
 * 浏览器提供了很多手段创建API
 * 流行度排行
 * 1. document.createElement
 * 2. innerHTML
 * 3. insertAdjacentHTML
 * 4. createContextualFragment
 */

// createElement
// 在IE6 - IE8中,他还有一种用法,能允许用户连同属性一起生成,比如document.createElement('<div id=aaa></div>')
// 此方法常见于生成带name属性的input与iframe元素, 因为IE6 - IE7下这两个元素的name属性是只读的,不能修改
function createNamedElement(type, name) {
    var element = null;
    // Try the IE way; this fails on standards-complaton browsers
    try {
        element = document.createElement('<' + type + ' name="' + name + '">');
    } catch (e) {}
    if (!element || element.nodeName != type.toUpperCase()) {
        // No - IE browsers
        element = document.createElement(type);
        element.name = name
    }
    return element;
}


// innerHTML
// 有兼容问题
// 1. IE会对用户字符串进行trimLeft操作, 但Firefox却没有
// 2. IE下有些元素节点是只读的: col colgroup frameset head html style table tbody tfoot thead title tr
// 3. IE的innerHTML会忽略no-scope element: 注释 style script link meta noscript等表示功能性的标签为no-scope element
//    想要用innerHTML生成他们, 必须在前面之前加上一些东西, 比如文字或其他标签
// 4. innerHTML不会执行script中的脚本.因此像jquery直接用正则把内容抽取出来后,直接eval
window.onload = function() {
    var div = document.createElement('div');
    div.innerHTML = ' <b>1</b><b>2</b> ';
    console.log(div.childNodes.length); // IE6 - IE8 弹出3 其他4
    console.log(div.firstChild.nodeType); //IE6 弹出1 其他3
}

window.onload = function() {    //在IE6 - IE8下测试
    var div = document.createElement('div');
    div.innerHTML = '<meta http-equiv="X-UA-Compatible" content="IE=9" />'
    console.log(div.childNodes.length);
    div.innerHTML = 'X<meta http-equiv="X-UA-Compatible" content="IE=9" />'
    console.log(div.childNodes.length);
}


// insertAdjacentHTML很灵活.可以插入元素内部的最前面(afterBegin)、内部的最后面(beforeEnd)、这个元素的前面(beforeBegin)、这个元素的后面(afterEnd)
// 如果浏览器不支持insertAdjacentHTML, 可以用createContextualFragment来模拟
if (typeof HTMLElement !== 'undefined' &&
    !HTMLElement.prototype.insertAdjacentElement) {
    HTMLElement.prototype.insertAdjacentElement = function(where, parsedNode) {
        switch (where.toLowerCase()) {
            case 'beforebegin':
                this.parentNode.insertBefore(parsedNode, this);
                break;
            case 'afterbegin':
                this.insertBefore(parsedNode, this.firstChild);
                break;
            case 'beforeend':
                this.appendChild(parsedNode)
                break;
            case 'beforebegin':
                if (this.nextSibling)
                    this.parentNode.insertBefore(parsedNode, this.nextSibling)
                else this.parentNode.appendChild(parsedNode)
                break;
        }
    }
    HTMLElement.prototype.insertAdjacentHTML = function(where, htmlStr) {
        var r = this.ownerDocument.createRange(),
            node = r.createContextualFragment(htmlStr);
        this.insertAdjacentElement(where, node);
        r = null
    }
    HTMLElement.prototype.insertAdjacentText = function(where, textStr) {
        var parseText = document.createTextNode(textStr);
        this.insertAdjacentElement(where, parseText);

    }
}

// template标签,它是一个天然的html parser,能将我们赋予它的字符串直接转换为文档碎片
var a = document.createElement('template');
a.innerHTML = '<div></div><p></p>';
console.log(a.content);     //返回一个fragment

