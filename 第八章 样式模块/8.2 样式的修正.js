/**
 * 1. float 是一个关键字, 因此不能直接用, IE的替代品是styleFloat, 但是标准的是cssFloat
 * 2. 各大厂商有自己的css前缀
 * IE      Firefox          Chrome      Safari      Opera       Konqueror
 * -ms-    -moz-            -webkit-    -webkit-    -o-         -khtml-
 * 
 * 要动用一个函数通过特性侦测手段获取它, 由于特性侦测是DOM操作,消耗很大,因此获取后应缓存起来, 避免重复检测
 */
var camelize = avalon.camelize;
var root = document.documentElement;
var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'];
var cssMap = {
    'float': window.Range ? 'cssFloat' : 'styleFloat'
};
avalon.cssName = function(name, host, camelCase) {
    if (cssMap[name]) {
        return cssMap[name];
    }
    host = host || root.style || {};
    for (var i = 0, n = prefixes.length; i < n; i++) {
        camelCase = camelize(prefixes[i] + name);
        if (camelCase in root) {
            return (cssMap[name] = camelCase)
        }
    }
    return null;
}

/**
 * prefixes的顺序很有说法, ''表示没有私有前缀, webkit使用的最多所以第二个 以此类推
 */
