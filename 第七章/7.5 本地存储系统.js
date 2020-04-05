/**
 * localStorage的问题
 * 1. localStorage大小限制在500万字符, 各浏览器不同
 * 2. localStorage在隐私模式下不可读取
 * 3. localStorage本质是在读写文件, 数据多的话会比较慢
 * 4. localStorage不能被爬虫爬取, 不要用它完全取代URL传参, 瑕不掩瑜
 * 以上问题皆可以避免, 所以我们的关注点应该放在如何使用localStorage.
 */

function getLocalStorage() {
    // 无痕浏览模式,会将localStorage禁用, 但是对象还在, 但是调用该对象方法会报错
    if (window.localStorage) {
        try {
            window.localStorage.setItem('key', 'value');
            window.localStorage.removeItem('key');
            return window.localStorage;
        } catch (error) {}
    }
}

var db = getLocalStorage();
if (db) {
    // 操作localStorage
}

