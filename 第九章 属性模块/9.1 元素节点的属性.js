/**
 * 浏览器提供了一组API来供人们操作特性
 * 即setAttribute getAttribute removeAttribute
 * 一般情况下这三个足矣
 * DOM特性系统对属性名进行小写化处理, 属性值会统一转字符串
 */

var el = document.createElement('div');
el.setAttribute('xxx', 1);
el.setAttribute('Xxx', 2);
el.setAttribute('XXx', 3);

console.log(el.getAttribute('xxx'))
console.log(el.getAttribute('Xxx'))

// IE6 IE7返回1 其他都返回3
// IE6 7 在处理property时要求进行名字映射, 比如class变成className, for变成htmlFor
// 对于一些布尔值, 浏览器之间差异更大

/*
<input type='radio' id='aaa' />
<input type='radio' id='bbb' checked />
<input type='radio' id='ccc' checked="checked" />
<input type='radio' id='ddd' checked="true" />
<input type='radio' id='eee' checked="xxx" />
*/
'aaa,bbb,ccc,ddd,eee'.replace(/\w+/g, function(id) {
    var elem = document.getElementById(id);
    console.log(elem.getAttribute('checked'))
})

/**
 *                  #aaa            #bbb            #ccc            #ddd            #eee
 * IE7              false           true            true            true            true
 * IE8              ''              'checked'       'checked'       'checked'       'checked'
 * IE9              null            ''              'checked'       'checked'       'xxx'
 * FF15             null            ''              'checked'       'checked'       'xxx'
 * Chrome23         null            ''              'checked'       'checked'       'xxx'
 * 
 */

/**
 * 到了IE8 你只能看到寥寥可数的几个特性节点, 成为显式属性(specified attribute)
 * 显式属性就是显式设置的属性, 分两种情况, 一种是卸载标签内的HTML属性, 一种是通过setAttribute动态设置的属性
 * 这些属性部分固有还是自定义, 只要设置了,就会出现在attributes中
 * 在IE6 IE7中我们可以通过节点的specified属性判断他是否被显式设置了
 * 在IE8和其他浏览器中, 直接使用hasAttribute API判定
 */

var isSpecified = !'1'[0] ?
    function(el ,attr) {return el.hasAttribute(attr)} :
    function(el, attr) {var val = el.attributes[attr]; return !!val && val.specified}
