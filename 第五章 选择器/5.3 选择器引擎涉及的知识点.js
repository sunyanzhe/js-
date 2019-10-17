/**
 * 
 * 
 * css 2.1 中属性选择器有以下4中形态
 * [att]        选取设置了att属性的元素,不管设定的是什么
 * [att=val]    选取所有att属性的值完全等于val的元素
 * [att~=val]   表示一个元素拥有属性att, 值为一个被空格隔开的多个字符串, 只要其中一个字符串等于val就能匹配上
 * [att|=val]   表示一个元素拥有属性att, 并且该属性含 val 或者 以 val-开头
 * 
 * css3 又新增了几种
 * [att^=val]   选取所有att属性的值以val开头的元素
 * [att$=val]   选取所有att属性的值以val结尾的元素
 * [att*=val]   选取所有att属性的值包含val字样的元素
 */

 //5.3.1关系选择器
 
// 1.后代选择器
document.all

// 2.亲子选择器
function getChildren(el) {
    if (el.childElementCount) {
        return [].slice.call(el.children);
    }
    var ret = [];
    for (var node = el.firstChild; node; node = node.nextSibling) {
        node.nodeType == 1 && ret.push(node);
    }
    return ret;
}

// 3. 相邻选择器
function getNext(el) {
    if ('nextElementSibling' in el) {
        return el.nextElementSibling;
    }
    while(el = el.nextSibling) {
        if (el.nodeType == 1) return el
    }
    return null
}

//4.兄长选择器
function getPrev(el) {
    if('previousElementSibling' in el) {
        return el.previousElementSibling;
    }
    while(el = el.previousSibling) {
        if (el.nodeType == 1) return el;
    }
    return null
}


//5.3.2伪类
//伪类是选择器中最庞大的家族 从CSS1中开始支持, 以字符串开头
//在CSS3中选了要求传参的结构伪类与取反伪类

    //1. 动作伪类 :link :visited :hover :active :focus
    //2. 目标伪类 :target 指id或name与URL的hash相匹配的元素
    var o = {
        'target': function(elem) {
            var hash = window.location.hash;
            return hash && hash.slice('1') == elem.id
        }
    }

    //3.语言伪类 :lang
    //lang伪类具有'继承性'
    //<body lang='de'><p>aaa</p></body>

    //如果使用[lang=de]只能匹配到body元素
    //但是使用:lang可以匹配到body和p元素
    
