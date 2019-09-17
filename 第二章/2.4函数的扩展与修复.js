//bind方法
Function.prototype.bind = function(context) {
    if (arguments.length < 2 && context == void 0) return this;
    var _method = this, args = Array.prototype.slice.call(arguments, 1);
    return function() {
        _method.apply(context, args.concat.apply(args, arguments));
    }
}

//curry
function curry(fn) {
    function inner(len, arg) {
        if (len <= 0) return fn.apply(null, arg);
        return function() {
            return inner(len - arguments.length, arg.concat(Array.apply([], arguments)));
        }
    }
    return inner(fn.length, []);        //fn.length
}


//partial
//curry的不足时参数总是通过push的方式来补全,而partial则是在定义时所有参数已经都有了
//但某些位置上的参数只是个占位符,我们接下来的传参只是替换掉他们

Function.prototype.partial = function() {
    var fn = this, args = Array.prototype.slice.apply(arguments);
    return function() {
        var arg = 0;
        for (var i = 0, len = args.length; i < len; i++) {
            if (args[i] === undefined) args[i] = arguments[arg++];      //使用undefined作为占位符
        }
        return fn.apply(this, args);
    }
}

var delay = setTimeout.partial(undefined, 10);
delay(function() {
    console.log('this call to will be temporarily delayed.')
})


//有关这个占位符, 该博客的评论列表中也有大量的讨论, 最后确定下来是使用_作为变量名,内部还是指向undefined
//这样做比较危险, 框架应该提供一个特殊的对象,比如Prototype内部使用$break={} 作为断点标识
//可以用一个纯空对象作为partial的占位符

var _ = Object.create(null);

function partial(fn) {
    var A = Array.prototype.slice.call(arguments, 1);
    return A.length < 1 ? fn : function() {
        var a = Array.prototype.slice.call(arguments);
        var c = A.concat(); //  复制一份
        for (var i = 0; i < c.length; i++) {
            if (c[i] === _) c[i] = a.shift(); 
        }
        return fn.apply(this, c.concat(a));
    }
}

function partial(fn, ...args) {
    return args.length < 1 ? fn : function() {
        let a = Array.prototype.slice.call(arguments),
            c = [...args];
        for (let i = 0; i < c.length; i++) {
            if (c[i] === _) c[i] = a.shift();
        }
        return fn.apply(this, c.concat(a));
    }
}

//函数的修复设计apply与call两个方法
//这两个方法本质就是生成一个新的函数,将原函数与用户传参放到里面执行而已
//在JavaScript创建一个函数有很多办法,常见的有函数声明和函数表达式, 次之是函数构造器, 再次是eval settimeout

Function.prototype.apply || (Function.prototype.apply = function(context, args) {
    context = context || window;
    args = args || [];
    context.__apply = this;
    if (!context.__apply) x.constructor.prototype.__apply = this;
    var result, len = args.length;
    switch (len) {
        case 0: r = context.__apply(); break;
        case 1: r = context.__apply(args[0]); break;
        case 2: r = context.__apply(args[0], args[1]); break;
        case 3: r = context.__apply(args[0], args[1], args[2]); break;
        case 4: r = context.__apply(args[0], args[1], args[2], args[3]); break;
        default: 
            var a = [];
            for (var i = 0; i < len; i++) {
                a[i] = "y[" + i + "]";
            }
            r = eval("x.__apply(" + a.join(",") + ")");
            break;
    }
    try {
        delete x.__apply ? x.__apply : x.constructor.prototype.__apply;
    } catch(e) {}

    return r;
})


Function.prototype.call || (Function.prototype.call = function() {
    var context = arguments[0],
        args = Array.prototype.slice.call(arguments, 1);
    return this.apply(x, y);
})
