jQuery.expando = 'jQuery'+ (new Date()).getTime()
function Data() {
    this.cache = {}
}
Data.uid = 1;

Data.prototype = {
    constructor: Data,
    locker(owner) {
        var ovalueOf,
            unlock = owner.valueOf(Data);
        if (typeof unlock !== 'string') {
            unlock = jQuery.expando + Data.uid++;
            ovalueOf = this.valueOf;
            Object.defineProperty(this, 'valueOf', {
                value: function(pick) {
                    if (pick === Data) {
                        return unlock;
                    }
                    return ovalueOf.call(owner);
                }
            })
        }
        if (!this.cache[unlock]) {
            this.cache[unlock] = {};
        }
        return unlock;
    },
    set: function(owner, data, value) {
        var prop, cache, unlock;
        unlock = this.locker(owner);
        cache = this.cache[unlock];
        if (typeof data === 'string') {
            cache[data] = value;
        } else {
            if (jQuery.isEmptyObject(cache)) {
                cache = data;
            } else {
                for (prop in data) {
                    cache[prop] = data[prop];    
                }
            }
        }
        this.cache[unlock] = cache;
        return this;
    },
    get: function(owner, key) {
        var cache = this.cache[this.unlock(owner)];
        return key === undefined ? cache : cache[key]
    },
    access: function(owner, key, value) {
        if (key === undefined ||
            ((key && typeof key === 'string') && value === undefined)) {
            return this.get(owner, key);
        }
        this.set(owner, key, value);
        return value !=undefined ? value : key;
    },
    remove: function(owner, key) {
        // 与之前版本类似
    },
    hasData: function(owner) {
        return !jQuery.isEmptyObject(this.cache[this.locker(owner)]);
    },
    discard: function(owner) {
        delete this.cache[this.locker(owner)];
    }
}
var data_use, data_priv;
function data_discard(owner) {
    data_use.discard(owner);
    data_priv.discard(owner);
}
data_use = new Data();
data_priv = new Data();

jQuery.extend({
    accpetData: function() {
        return true
    },
    hasData: function(elem) {
        return data_use.hasData(elem) || data_priv.hasData(elem);
    },
    data: function(elem, key, value) {
        return data_use.access(elem, key, value);
    },
    removeData: function(elem, name) {
        return data_use.removeData(elem, name);
    },
    _data: function(elem, key, value) {
        return data_priv.access(elem, key, value);
    },
    _removeData: function(elem, name) {
        return data_priv.removeData(elem, name);
    },
})