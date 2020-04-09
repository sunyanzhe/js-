function test() {
    var a = document.getElementById('test');
    a.setAttribute('title', 'title');
    a.setAttribute('title2', 'title2');
}
// IE8下打印出
// <STRONG id=test title=title title2="title2">孙延哲</STRONG>

// Firefox15 Chrome23 IE9下打印出
// <strong id="test" title2="title2" title="title">孙延哲</strong>

// 如果是特性, 以el[xxx] = yyy的形式赋值, 再用el.getAttribute()来取值, 肯定能取到东西
// 但是属性就不一样

var a = document.getElementById('test');
a.name = 222
console.log(a.getAttribute(name)); //222
console.log(typeof a.getAttribute(name));   //string

a.setAttribute('custom', 'custom');
console.log(a.custom);      //undefined
console.log(typeof a.custom);//'undefined'

// 不过要注意IE6 IE7下的特例
a.setAttribute('innerHTML', 'xxx');
console.log(a.innerHTML);       //xxx

var div = document.createElement('div');
console.log(div.getAttribute('title'));
console.log(div.getAttribute('innerHTML'));
console.log(div.getAttribute('xxx'));
console.log(div.title);
console.log(div.innerHTML);
console.log(div.xxx);

// IE6 IE7 下返回 '' '' null '' '' undefined
// IE8 IE9 Chrome FF15 Opera12下返回 null null null '' '' undefined

function isAttribute(attr, host) {
    host = host || document.createElement('div');
    return host.getAttribute('attr') === null && host.attr === void 0
}
