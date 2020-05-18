var tpl = '你好, 我的名字是<% name %>, 今年<% info.age %>岁了'
var data = {
    name: 'sunyanzhe',
    info: {
        age: 20
    }
}

// 词法解析
function tokenize(str) {
    var openTag = '<%'
    var endTag = '%>'
    var ret = [];
    do {
        var index = str.indexOf(openTag)
        index = index === -1 ? str.length : index
        var value = str.slice(0, index);
        ret.push({
            expr: value,
            type: 'text'
        })
        str = str.slice(index + openTag.length)
        if (str) {
            index = str.indexOf(endTag);
            var value = str.slice(0, index);
            ret.push({
                expr: value.trim(),
                type: 'js'
            })
            str = str.slice(index + endTag.length)
        }
    } while (str.length)
    return ret
}
console.log(tokenize(tpl))

// 拼接
function render(str) {
    var tokens = tokenize(str);
    var ret = []
    for (var i = 0, token; token = tokens[i++];) {
        if (token.type === 'text') {
            ret.push('"' + token.expr + '"')
        } else {
            ret.push(token.expr)
        }
    }
    console.log('return ' + ret.join('+'))
}


console.log(render(tpl))

// 这个方法还不完整, 有限只是在两旁加上双引号是不可靠的, 万一里面也有双引号怎么办.
// 因此我们需要引入quote方法, 当类型为文本时, ret.push(+ quote(token.expr) +)
// 其次需要对动态部分的变量加上data.
// 怎么知道他是一个变量呢? 我们回想一下变量的定义, 就是以_ $或字母开头的字符组合
// 为了简洁起见我们不理会中文的情况
// 不过info.age这个字符串里面, 其实与两个符合变量的子串, 而只需要在info前面加data.
// 这是我们需要设法在匹配变量前, 将对象的子集户型替换掉,替换成不符合变量的字符, 然后再替换回去

var quote = JSON.stringify
var rident = /[$a-zA-Z_][$a-zA-Z0-9_]*/g
var rproperty = /\.\s*[\w\.\$]+/g
var number = 1
var rfill = /\?\?\d+/g
var stringPool = {}

function dig(a) {
    var key = '??' + number++
    stringPool[key] = a
    return key
}
function fill(a) {
    return stringPool[a]
}
