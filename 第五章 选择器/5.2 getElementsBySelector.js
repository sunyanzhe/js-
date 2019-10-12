/**
 * document.getElementsBySelector(selector)
 * New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
 * Version 0.4 - Simon Willison, March 25th 2003
 * --Works in Phoenix 0.5, Mozilla 1.3, Opera 7, IE6, IE5 on Windows
 * -- Opera 7 fails
 */



//获取一个元素的所有子孙
function getAllChildren(e) {
    return e.all ? e.all : e.getElementsByTagName('*');
}

document.getElementsBySelector = function(selector) {
    //如果不支持getElementsByagName则直接返回空数组
    if (!document.getElementsByTagName) {
        return new Array();
    }
    //切割CSS选择符, 分解一个个单元(每个单元可能代表一个或几个选择器, 比如p.aaa则由标签选择器与类选择器组成)
    var tokens = selector.split(' ');
    var currentContext = new Array(document);

    //从左到右检查每个单元, 换言之此引擎是自顶向下选元素
    //我们的结果集如果中间为空, 那么会立即中止此循环了
    for (var i = 0, len = tokens.length; i < len; i++) {
        //去掉两边的空白
        //并不是所有的空白都是没用的,两个选择器组之间的空白代表后代选择器
        var token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');

        //如果包含ID选择器,这里略显粗糙,因为他可能在引号里面
        //此选择器支持到属性选择器, 则代表着它可能是属性值的一部分
        if (token.indexOf('#') > -1) {
            //这里假设这个选择器组以tag#id 或 #id的形式组成, 可能导致BUG
            //但这暂且不谈, 我们沿着作者的思路进行下去
            var bits = token.split('#');
            var tagName = bits[0];
            var id = bits[1];
            //先用ID值取得元素, 然后判定元素的tagName是否等于上面的tagName
            //此处有一个不严谨的地方, element可能为null, 会引发异常
            var element = document.getElementById(id);
            if (tagName && element.nodeName.toLowerCase() != tagName) {
                // 没有直接返回空结果集
                return new Array();
            }
            //置换currentContext,跳至下一个选择器组
            currentContext = new Array(element);
            continue;
        }

        //如果包含类选择器, 这里也假设它以.class或tag.class的形式
        if (token.indexOf('.') > -1) {
            var bits = token.split('.');
            var tagName = bits[0];
            var className = bits[1];
            if (!tagName) tagName = '*';

            //从多个父节点出发, 取得他们的所有子孙
            //这里的父节点即包含在currentContext的元素节点或文档对象
            var found = new Array();        //这里是过滤集, 通过检测他们的className决定去留
            var foundCount = 0;
            for (var h = 0; h < currentContext.length; h++) {
                var elements;
                if (tagName == '*') {
                    elements = getAllChildren(currentContext[h])
                } else {
                    elements = currentContext[h].getElementsByTagName(tagName);
                }
                for (var j = 0; j < elements.length; j++) {
                    found[foundCount++] = element[j];
                }
            }
            currentContext = new Array();
            var currentContextIndex = 0;
            for (var k = 0; k < found.length; k++) {
                //found[k].className可能为空, 因此不失为一种优化手段, 但是new RegExp可以放在循坏外
                if (found[k].className && found[k].className.match(new RegExp('\\b' + className + '\\b'))) {
                    currentContext[currentContextIndex++] = found[k];
                }
            }
            continue;
        }

        //如果是以tag[attr(~|^$*)=val]或者[attr(~|^$*)=val]的形式
        if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\"]]*)"?\]$/)) {
            var tagName = RegExp.$1,
                attrName = RegExp.$2,
                attrOperator = RegExp.$3,
                attrValue = RegExp.$4;
            if (!tagName) targName = "*";
            //这里的逻辑和上面的class部分相似, 其实应该抽取成独立的函数
            var found = new Array();
            var foundCount = 0;
            for (var h = 0; h < currentContext.length; h++) {
                var elements;
                if (tagName == '*') {
                    elements = getAllChildren(currentContext[h]);
                } else {
                    elements = currentContext[h].getElementsByTagName(tagName)
                }
                for (var j = 0; j < elements.length; j++) {
                    found[foundCount++] = elements[j];
                }
            }
            currentContext = new Array();
            var currentContextIndex = 0,
                checkFunction;
            
            //根据第二个操作符生成检测函数,后面会详解,这里不展开
            switch (attrOperator) {
                case '=':
                    checkFunction = function(e) {return (e.getAttribute(attrName) == attrValue);};
                    break;
                case '~':
                    checkFunction = function(e) {return (e.getAttribute(attrName).match(new RegExp('\\b' + attrValue + '\\b')));};
                    break;
                case '|':
                    checkFunction = function(e) {return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')));};
                    break;
                case '^':
                    checkFunction = function(e) {return (e.getAttribute(attrName).indexOf(attrValue) == 0);};
                    break;
                case '$':
                    checkFunction = function(e) {return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length);};
                    break;
                case '*':
                    checkFunction = function(e) {return (e.getAttribute(attrName).indexOf(attrValue) > -1);};
                    break;
                default:
                    checkFunction = function(e) {return e.getAttribute(attrName)};
            }
            for (var k = 0; k < found.length; k++) {
                if (checkFunction(found[k])) currentContext[currentContextIndex++] = found[k];
            }
            continue;
        }
        
        //如果没有 '#' '.' ',' '['这样的特殊字符 我们就当成是tagName
        tagName = token;
        var found = new Array();
        var foundCount = 0;
        for (var h = 0; h < currentContext.length; h++) {
            var elements = currentContext[h].getElementsByTagName(tagName);
            for (var j = 0; j < elements.length; j++) {
                found[foundCount++] = elements[j];
            }
        }
        currentContext = found;
    }
    return currentContext;
}

//这个库不怎么重视全局污染
//主要API直接在document上操作, 参数只有一个CSS表达符
//从分析来看,并不支持联选择器并且每个选择器组不能超过两个,否则报错
//换言之,它只对下面这样形式的CSS表达式有效

//#aa p.bbb [ccc=ddd]

