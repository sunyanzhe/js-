//4.1 相当精巧的库 P.js
var P = (function(prototype, ownProperty, undefined) {
    function isObject(o) {
        return typeof o === 'object'
    }

    function isFunction(o) {
        return typeof o === 'function'
    }
    
    function BareConstructor() {}

    function P(_superclass, definition) {
        //如果只传一个参数,没有指定父类
        if (definition === undefined) {
            definition = _superclass;
            _superclass = Object;
        }

        //C是我们要返回的子类, definition中的init为用户构造器
        function C() {
            var self = new Bare;
            console.log(self.init);
            if(isFunction(self.init)) self.init.apply(self, arguments);
            return self;
        }

        function Bare() {}  //这个构造器为了让C不用new就能返回实例而设置的
        C.Bare = Bare;

        //为了防止改动子类影响父类,我们将父类的原型赋给了一个中介者BareConstructor
        //然后再将这个中介者的实例作为子类的原型
        
        var _super = BareConstructor[prototype] = _superclass[prototype];
        var proto = Bare[prototype] = C[prototype] = new BareConstructor;

        //然后C与Bare共享一个原型
        //最后修正子类的构造器指向自身
        proto.constructor = C;

        //类方法mixin,不够def对象里面的属性与方法糅杂到原型中去
        C.mixin = function(def) {
            Bare[prototype] = C[prototype] = P(C, def)[prototype];
            return C;
        }

        //definition最后延迟到这里才起作用
        return (C.open = function(def) {
            var extensions = {};
            //definiton有两种形态
            //如果是函数, 那么子类原型,父类原型, 子类构造器, 父类构造器传进去
            //如果是对象则直接置为extensions
            if(isFunction(def)) {
                extensions = def.call(C, proto, _super, C, _superclass)
            } else if (isObject(def)) {
                extensions = def;
            }

            //最后混入子类的原型
            if (isObject(extensions)) {
                for (var ext in extensions) {
                    if (ownProperty.call(extensions, ext)) {
                        proto[ext] = extensions[proto];
                    }
                }
            }

            //确保init是一个函数
            if (!isFunction(proto.init)) {
                proto.init = _superclass;
            }
            return C;
        })(definition);
    }
    return P;
    
})('prototype', ({}).hasOwnProperty);

//尝试创建一个类
var Animal = P(function(proto, superProto) {
    proto.init = function(name) {           //构造函数
        this.name = name;
    }
    proto.move = function(metters) {        //原型方法
        console.log(this.name + 'move' + metters + 'm.');
    }
})

var a = new Animal('aa');       
var b = new Animal('bb');       //无'new'实例化

var Snake = P(Animal, function(snake, animal) {
    snake.init = function(name, eyes) {
        animal.init.call(this, arguments);      //调用父类构造器
        this.eyes = 2;
    }
    snake.move = function() {
        console.log('slithering...');
        animal.move.call(this, 5);  //调用父类同名方法
    }
})


//2.JS.Class
var JS = {version : '2.2.1'}

JS.Class = function(classDefinition) {
    //返回目标类的真正构造器
    function getClass() {
        return function() {
            if (typeof this['construct'] === 'function' && preventJSBaseConstructorCall === false)
                this['construct'].apply(this, arguments);
        }
    }
    //为目标类添加类成员与原型成员
    function createClassDefinition(classDefinition) {
        //此对象用于保存父类的同名方法
        var parent = this.prototype['parent'] || (this.prototype.parent =  {});
        for (const prop in classDefinition) {
            if (prop === 'statics') {
                for (var sporp in classDefinition.statics) {
                    this[sporp] = classDefinition.statics[sprop];
                }
            } else {
                //这里的this.prototype[prop] 其实指向的是父类有没有同名方法
                //因为赋值是在最后面所以当前的prototype是不可能有这个属性的
                //如果有的话就把父类的方法放到parent中
                if (typeof this.prototype[prop] === 'function') {
                    var parentMethod = this.prototype[prop];
                    parent[prop] = parentMethod;
                }
                this.prototype[prop] = classDefinition[prop];
            }
        }
    }

    var preventJSBaseConstructorCall = true;
    var Base = getClass();
    preventJSBaseConstructorCall = false;

    createClassDefinition(Base, classDefinition);

    Base.extend = function(classDefinition) {
        preventJSBaseConstructorCall = true;
        var SonClass = getClass();
        //这里preventJSBaseConstructorCall为true 所以不会走construct
        //这样SonClass的prototype是一个空的对象
        //也就是说只继承了父类原型的属性 并不会继承父类的特权属性;
        SonClass.prototype = new this();
        preventJSBaseConstructorCall = false;

        createClassDefinition(SonClass, classDefinition);
        SonClass.extend = this.extend;
        
        return SonClass;
    }
    return Base;
}

var Animal = JS.Class({
    construct: function(name) {
        this.name = name
    },
    shout: function(s) {
        console.log(s);
    }
})

var Dog = Animal.extend({
    construct: function(name, age) {
        this.parent.construct.call(this, name);
        this.age = age;
    },
    run: function(s) {
        console.log(s);
    }
})

var Shepherd = Dog.extend({
    statics: {
        TYPE: 'Shepherd'
    },
    run: function() {
        this.parent.run.call(this, 'fast');
    }
})


//Jhon Resig 大神 真的很精巧 simple-inheritance
(function() {
    var initializing = false,           //这个变量和Bare2中的都是一个意思 为了不让父级的init执行
        fnTest = /xyz/.test(function(){ 
            xyz;
        }) ? /\b_super\b/ : /.*/;
    //是用来判定函数的toSring是否能暴露里面代码的实现
    //如果能显示,判断里面有没有_super
    //一些老的浏览器并不能展示函数内的代码
    //所以只能搞一个怎么都返回true的正则

    //这是所有的基类
    //这里的this. 嗯,没错的你没想错 他就是window
    this.Class = function(){};

    //生成目标的子类
    Class.extend = function(prop) {
        //这个this指向分两种情况
        //第一种由基类创建出来的第一个类, 那这个this就是指向Class的
        //第二种继承, 这个this就指向了父级
        //第一种情况的this就是指向的上面的Class而不是下面的
        var _super = this.prototype;

        //阻止init触发
        initializing = true;
        var prototype = new this();
        //重新打开 以便用户创建实例
        initializing = false;

        for(var name in prop) {
            prototype[name] = typeof _super[name] === 'function' && typeof prop[name] === 'function' && fnTest.test(prop[name]) ?
                //哇 这里真的要说的太多了 一步一步来
                //首先循环 判断属性是方法 并且父级有这个方法 并且函数里面有_super
                //搞了一个闭包,把当前的 属性 以及 属性对应的方法 传了进去
                //返回一个函数,这里就要注意了,意思是原型上绑定的那个属性 其实是闭包返回的这个函数, 而不是参数上写的那个
                //第一步是把原型上以防万一如果这兄弟有个_super这么个属性, 那就先给存起来
                //然后就给他换成_super父类原型的 对应方法
                //然后执行就行了
                //执行完了就换回来this._super
                //重点说一下this的问题, 估计会觉得闭包这个this应该指向window了 其实不是, 
                //因为返回的函数被绑定到了子类原型对象上, 所以this指向的是子类的原型    
                (function(name, fn) {
                    return function() {
                        let tmp = this._super;
                        this.super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;
                        return ret;
                    }
                })(name, prop[name]) : 
                prop[name];
        }
        //目标类的真实构造器
        function Class() {
            //这里的this指向的就是原型了
            if (!initializing && this.init) 
                this.init.apply(this, arguments)
        }

        //把刚刚搞好的prototype给Class
        Class.prototype = prototype;
        //万一参数里面有个constructor属性 让用户xjb改了 那咱们自己在改回来
        //固定好就是Class
        Class.prototype.constructor = Class;
        //这句话是真的有学问, 这个Class其实指的已经是子类了
        //这个其实是给子类加一个类方法 为了让继续继承用
        Class.extend = arguments.callee;

        return Class
    }
})();

var Animal = Class.extend({
    init(name) {
        this.name = name;
    },
    shout: function(s) {
        console.log(s)
    }
})

var animal = new Animal();

var Dog = Animal.extend({
    init(name, age) {
        //调用父级构造器
        this._super.apply(this, arguments);
        this.age = age
    },
    run(s) {
        console.log(s)
    }
})



(function(global) {
    //首先这个deferred是个函数
    //1. def('Animal')时就是返回的就是deferred
    //2. 在继承父类时 < 出发两者调用valueOf, 此时会执行deferred.valueOf里面的逻辑
    //3. 在继承父类时，父类的后面还可以接括号, 当做传送器保存着父类与扩展包到_super _props
    var deferred; 


    //扩展自定义类的原型
    function extend(source) {
        var prop, target = this.prototype;
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                prop = target[key] = source[key];
                if (typeof prop === 'function') {
                    //这里给原型的每个方法都加上了名字 和对应的类
                    //目的是为了可以通过这个类 找到自己父类  通过名字调用父类相同名字的函数
                    prop._name = key;
                    prop._class = this;
                }
            }
        }
        return this;
    }

    //这个其实就是Object.create里面的那个 function F(){} 说白了就是继承用的
    function SubClass() {}


    //在类中看到的this._super()这样 调用父类 实际上就是走的这个方法
    function base() {
        //这里的caller指的是外部包含着它的那个函数
        //比如 init: function() {this._super()}  这个caller指的就是 这个init属性方法
        var caller = base.caller;
        //这里其实有点复杂 慢慢解读
        //caller._class 指的就是当前拥有这个方法的类了
        //caller._class._super 指的就是这个类的父类
        //caller._class._super.prototype[caller._name] 这里就是拿到与父类同名的方法
        //后面就比较好理解了 如果自己有参数就传自己的 如果没有，就传上一层函数的参数
        //这里的 ._class 和 ._name都是在extend的时候 已经给方法绑定好的
        return caller._class._super.prototype[caller._name].apply(this, arguments.length ? arguments : caller.arguments)
    }
    function def(context, klassName) {
        klassName || (klassName = context, context = global);

        //给全局 或者某对象上创建个类
        var Klass = context[klassName] = function Klass() {
            //这个判断真的很精妙
            //这个判断的意思是 是否使用了new
            //当如果使用了new的话 this指向的就应该是实例
            //而如果只是当做普通函数进行使用的话 this应该与context这个作用域是相等的

            if (this != context) {
                this.init && this.init.apply(this, arguments);
            }
            
            //这里其实是为了实现继承用的
            //首先这里是new 实例的时候 或者 调用类方法的时候 才会走这里
            //new的时候 其实这里没什么用
            //关键是 类作为普通函数使用的时候
            //这也是继承时的情况
            // def('A')({})
            // def('B') < A({})
            // 当第二步A作为普通函数执行时, deferred的._super属性赋值为了 A  将._props属性赋值为了里面唯一的参数也就是 构造类的参数
            deferred._super = Klass;
            deferred._props = arguments[0] || {};
        }
        //让所有的类都共用一个extend方法
        Klass.extend = extend;


        //这里就是将所有传进去的参数都重写以后,把_class和_name都绑好了
        //为以后的继承做准备, 最后返回一个Klass
        //这里调用 其实也就是 第一次新建类的时候调用 就是用户自己调用 def('A')({}) 也就这个时候({}) 用户调用了
        //继承的时候 其实是valueOf方法内部进行了自动调用
        deferred = function(props) {
            return Klass.extend(props);
        }

        //继承最关键的一步 < 运算符的时候 其实是调用了 函数valueOf方法
        //所以改写valueOf
        
        deferred.valueOf = function() {
            var SuperClass = deferred._super;
            if (!SuperClass) {
                return Klass;
            }

            SubClass.prototype = SuperClass.prototype;
            var proto = Klass.prototype = new SubClass();
            Klass._class = Klass;
            Klass._super = SuperClass;

            proto.constructor = Klass;
            proto._super = base;
            deferred(deferred._props);
        }
        return deferred;
    }
    global.def = def;
})(this)