/**
 * jQuery 先用setAttribute设置className, 然后看它是当做特性还是属性, 如果是当做特性, 用el.className就取不到值
 */
el.setAttribute('className', 't');
console.log(el.className !== 't');

