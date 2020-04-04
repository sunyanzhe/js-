// 一个简单的带容量的缓存系统
function createCache(size) {
    var keys = [];
    function cache(key, value) {
        // 避开IE6 - IE8的toString和valueOf方法
        // 及cache本身的name length属性
        if (keys.push(key + ' ') > size) {
            delete cache[keys.shift()];
        }
        return (cache[key + ' '] = value);
    }
    return cache;
}
var cache = createCache(100);
cache('aaa', 'bbb')
console.log(cache.aaa);

/**
 * 此缓存体完全相信是jQuery的哈希寻找算法实现的, 当一个缓存体的键值对数量非常庞大,要命中一个键名就可能很花时间
 * 于是我们需要求助一些其他的缓存算法
 * 下面是一个链表加hashmap的缓存
 */
function LRU(maxLength) {
    this.head = this.tail = void 0;
    this.size = 0;
    this.limit = maxLength;
    this._keymap = {};
}
var p = LRU.prototype;
p.put = function(key, value) {
    // 创建节点
    var entry = {
        key: key,
        value: vlaue
    }
    // 调整链表
    if (this.tail) {
        this.tail.newer = entry;
        entry.older = this.tail;
    } else {
        this.head = entry;
    }
    this.tail = entry;
    if (this.size === this.limit) {
        this.shift();
    } else {
        this.size++;
    }
    return value;
}

p.shift = function() {
    var entry = this.head;
    if (entry) {
        this.head = this.head.newer;
        this.head.older = 
            entry.newer = 
            entry.older = 
            this._keymap[entry.key] = void 0;
        delete this._keymap[entry.key];
    }
}

p.get = function(key) {
    var entry = this._keymap[key];
    if (entry === void 0) return
    if (entry === this.tail) return entry.value;
    if (entry.newer) {
        if (entry === this.head) {
            this.head === entry.newer;
        }
        entry.newer.older = entry.older;
    }
    if (entry.older) {
        entry.older.newer = entry.newer;
    }
    entry.newer = void 0;
    entry.older = this.tail;
    if (this.tail) {
        this.tail.newer = entry;
    }
    this.tail = entry;
    return entry.value;
}
var a = new Cache(100);
a.put('aaa', 'bbb');
console.log(a.get('aaa'));
