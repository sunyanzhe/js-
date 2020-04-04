function Data() {
    this.expando = jQuery.expando + Data.uid++;
}
Data.uid = 1;
Data.prototype = {
    cache: function(owner) {
        var value = owner[this.expando];
        if (!value) {
            value = {};
            // 只有window 元素 和 document
            if (acceptData(owner)) {
                if (owner.nodeType) {
                    owner[this.expando] = value;
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value: value,
                        configurable: true
                    })
                }
            }
        }
        return value;
    },
    set: function(owner, data, value) {
        var prop,
            cache = this.cache(owner);
        // 三个参数
        if (typeof data === 'string') {
            cache[jQuery.camelCase(data)] = value
        } else {
            // 两个参数
            for (prop in data) {
                cache[prop] = data[prop];
            }
        }
        return cache;
    }
}