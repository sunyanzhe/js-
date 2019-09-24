function extend(destinations, source) {
    for (var property in source) destinations[property] = source[property];
    return destinations;
}

function inherit(init, Parent, proto) {
    function F() {
        Parent.call(this);
        init.call(this);
    }
    F.prototype = Object.create(Parent.prototype);
    F.prototype.constructor = F;
    extend(F.prototype, proto);
    extend(F, Parent);
    return F;
}


function A() {}
A.prototype = {
    aa: 1
}

let a = new A()
console.log(a.aa)       //1;
A.prototype = {
    aa: 2
}
console.log(a.aa)       //1

//new发生了什么事情
/*
1.创建了一个空对象instance
2.instance.__proto__ = instanceClass.prototype
3.将构造器函数里面的this = instance
4.执行构造器里面的代码
5.判定有没有返回值,如果有,则判定返回值的类型,如果类型为Object, Array等复合数据类型, 则返回该对象, 否则返回this(实例)
*/

