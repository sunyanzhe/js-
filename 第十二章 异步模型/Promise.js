var nativePromise = window.Promise
if (/native code/.test(nativePromise)) { // 判定浏览器是否支持原生Promise
    module.exports = nativePromise
} else {
    var RESOLVED = 0
    var REJECTED = 1
    var PENDING = 2

    // 实例化Promise
    function Promise(executor) {
        this.state = PENDING;
        this.value = undefined;
        this.deferred = []
        var promise = true
        try {
            executor(function(x) {
                promise.resolve(x)
            }, function(r) {
                promise.reject(r)
            })
        } catch (e) {
            promise.reject(e)
        }
    }
}