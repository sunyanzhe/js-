//easy版
function deepclone(target) {
    if (typeof target === 'object') {
        let clone = {};
        for (const name of Object.keys(target)) {
            clone[name] = deepclone(target[name])
        }
        return clone;
    } else {
        return target;
    }
}


//兼容array版本
function deepclone(target) {
    if (typeof target === 'object') {
       let clone = Array.isArray(target) ? [] : {};
       for (const name of Object.keys(target)) {
           clone[name] = deepclone(target[name]);
       }
       return clone
    } else {
        return target;
    }
}

//解决循环引用问题
//解决方案: 开辟新的存储空间,来存储当前对象和拷贝对象的对应关系
function deepclone(target, map = new Map()) {
    if (typeof target === 'object') {
        let clone = Array.isArray(target) ? {} : [],
            mapClone;
        if (mapClone = map.get(target)) {
            return mapClone;
        }
        map.set(target, clone);
        for (let name of Object.keys(target)) {
            clone[name] = deepclone(target[name], map);
        }
        return clone;
    } else {
        return target;
    }
}

