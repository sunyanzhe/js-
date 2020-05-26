function Promise(executor) {
    var self = this
    self.status = 'pending'
    self.onResolvedCallback = []
    self.onRejectedCallback = []
    function resolve(value) {
        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        setTimeout(function() {
            if (self.status === 'pending') {
                self.status = 'resolved'
                self.data = value
                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value)
                }
            }
        })
    }
    function reject(reason) {
        setTimeout(function() {
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason
                for (var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](reason)
                }
            }
        })
    }
    try {
        executor(resolve, reject)
    }catch(e){
        reject(e)
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    var then,
        thenCalledOrThrow = false
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }
    if (x instanceof Promise) {
        if (x.status === 'pending') {
            x.then(function(value) {
                resolvePromise(promise2, vlaue, resolve, reject)
            })
        } else {
            x.then(resolve, reject)
        }
        return
    }

    if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            then = x.then
            if (typeof then === 'function') {
                then.call(x, function rs(v) {
                    if (thenCalledOrThrow) return
                    thenCalledOrThrow = true
                    return resolvePromise(promise2, v, resolve, reject)
                }, function rj(r) {
                    if (thenCalledOrThrow) return
                    thenCalledOrThrow = true
                    return reject(r)
                })
            } else {
                resolve(x)
            }
        } catch(e) {
            if (thenCalledOrThrow) return
            thenCalledOrThrow = true
            return reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.prototype.then = function(onResolved, onRejected) {
    var self = this
    var promise2
    onResolved = typeof onResolved === 'function' ? onResolved : function(v) {return v}
    onRejected = typeof onRejected === 'function' ? onRejected : function(v) {throw v}
    if (self.status === 'resolved') {
        return promise2 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    var x = onResolved(self.data)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        })
    }
    if (self.status === 'rejected') {
        return promise2 = new Promise(function(resolve, reject) {
            setTimeout(function() {
                try {
                    var x = onRejected(self.data)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        })
    }

    if (self.status === 'pending') {
        return promise2 = new Promise(function(resolve, reject) {
            self.onResolvedCallback.push(function(value) {
              try {
                var x = onResolved(value)
                if (x instanceof Promise) {
                    x.then(resolve, reject)
                } else {
                    resolve(x)
                } 
              } catch (r) {
                reject(r)
              }
            })
      
            self.onRejectedCallback.push(function(reason) {
                try {
                  var x = onRejected(reason)
                  resolvePromise(promise2, x, resolve, reject)
                } catch (r) {
                  reject(r)
                }
              })
          })
    }
}