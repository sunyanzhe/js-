function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return '(' + this.x + this.y + ')';
}

//=========

class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `${this.x}, ${this.y}`;
    }
}


//====继承
class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y);        //调用父类的constructor(x, y)
    }
    toString() {
        return `${this.color}` + super.toString();          //调用父类的toString
    }
}


//ES6允许继承原生构造函数定义子类
//这意味着,ES6可以自定义原生数据结构(比如 Array String等)
//这是ES5无法做到的

class VersionArray extends Array {
    constructor() {
        super();
        this.history = [[]];
    }
    commit() {
        this.history.push(this.slice());
    }
    revert() {
        this.splice(0, this.length, ...this.history[this.history.length - 1])
    }
}


//目前ES6这个机制还在不断改良
//其中最大的践行者就是React Native, 其甚至还提供了更好的语法
//而无论ES6的原生语法还是 RN 的改良语法 我们无法一时三刻直接使用在浏览器中
//这时就需要使用babel编译JavaScript
//比如 如下代码
class View {
    constructor(options) {
        this.model = options.model;
        this.template = options.template;
    }
    render() {
        return _.template(this.template, this.model.toObject());
    }
}

//实例化父类View
var view = new View({
    template: 'Hello, <%= name %>'
});

//定义子类LogView,继承父类View
class LogView extends View {
    render() {
        var compiled = super.render();
        console.log(compiled);
    }
}


//编译后其骨干大概是这样(随着babel的版本, 结果当然不同).
//借此机会, 我们也可以窥探一下ES6的类工厂是怎么样的

var View = (function() {
    function View(options) {
        _classCallCheck(this, View);
        this.model = options.model;
        this.template = options.template;
    }
    _createClass(View, [{
        key: 'render',
        value: function render() {
            return _.template(this.template, this.model.toObject());
        }
    }]);
    return View;
})()

var LogView = (function() {
    _inherits(LogView, _View);
    function LogView() {
        _classCallCheck(this, LogView);
        _get(Object.getPrototypeOf(LogView.prototype), 'constructor', this).apply(this, arguments);
    }
    _createClass(LogView, [{
        key: 'render',
        value: function render() {
            var compiled = _get(Object.getPrototypeOf(LogView.prototype), 'render', this).call(this);
            console.log(compiled);
        }
    }])
})(View)

