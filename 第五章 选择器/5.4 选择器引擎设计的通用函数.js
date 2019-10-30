
/** 
 * isXML
*/
//最强大的几名选择器都能操作XML文档, 但是XML与HTML存在很大的差异,没有className和getElementById,并且NodeName是区分大小写的
//在旧版本IE中还不能直接给XML元素添加自定义属性,因此区分XML和HTML是很有必要的

//Sizzle实现
var isXML = Sizzle.isXML = function(elem) {
    var documentElement = elem && (elem.ownerDocument || elem).documentElement;
    return documentElement ? documentElement.nodeName !== 'HTML' : false;
}

//但这样不严谨, 因为XML的根节点可能是HTML标签,比如这样创建一个XML文档:
try {
    var doc = document.implementation.createDocument(null, 'HTML', null);
    alert(doc.documentElement);
    alert(isXML(doc))
} catch(e) {
    alert('不支持createDocument方法')
}


//mootools的slick的实现
var isXML = function(document) {
    return (!! document.xmlVersion) || (!! document.xml) || (toString.call(document) == '[object XMLDocument]') ||
        (document.nodeType == 9 && document.documentElement.nodeName != 'HTML')
}

//mootools用到了大量属性来判定, 从mootools1.2到现在还没什么改动, 说明还是很可靠的
//我们再精简一下, 在标准浏览器,暴露了一个创建HTML文档的构造器HTMLDocument, 而IE下的XML元素又拥有selectNodes

var isXML = window.HTMLDocument ? function(doc) {
    return !(doc instanceof HTMLDocument)
} : function(doc) {
    return 'selectNodes' in doc;
};

//不过这些方法都只是规范, JavaScript对象可以随意添加, 属性发很容易就被攻破
//最好使用功能法.无论XML或HTML文档都支持createElement方法,我们判定创建元素的nodeName是否区分大小写
var isXML = function(doc) {
    return doc.createElement('p').nodeName !== doc.createElement("P").nodeName;
}
//这个是最严谨的函数了



/**
 * contains
 */

 //contains方法就是判定参数1是否包含参数2.
 //这通常用于优化, 比如早起的SIzzle, 对于#aaa p.class这个选择符,他就会有限用getElementsByClassName或getElementsByTagName取种子集
 //然后就不继续往左走了, 直接跑到最左的#aaa 取得#aaa元素, 通过contains方法进行过滤
 //随着Sizzle的体积进行走大, 他现在只剩下另一个关于ID的用法, 即, 如果有上下文对象非文档对象, 那么他会取得其ownerDocument
 //这样就可以用getElementById, 然后利用contains方法进行验证

result = []
var newContext = context.nodeType === 9 ? context : context.ownerDocument;
if (newCotent &&
    (elem = newContext.getElementById(m)) &&
    cotains(context, elem) &&
    elem.id === m) {
    result.push(elem);
    return result;        
}

//contains实现
var rnative = /^[^{]+\{\s*\[native \w/,
    hasCompare = rnative.test(document.compareDocumentPosition),
    contains = hasCompare || rnative.test(docElem.contains) ? 
    function(a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && (
            adown.contains ? 
            adown.contains(bup) :
            a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
        )) 
    } :
    function(a, b) {
        if (b) {
            while(b = b.parentNode) {
                if (b === a) return true;
            }
        }
        return false;
    }


//由于旧版本IE不支持compareDocumentPosition, 因此Jquery的作者写了一个兼容函数sourceIndex, 用到IE的另一个私有实现
//sourceIndex会根据元素的位置从上到下,从左到右依次加1, 比如HTML标签的sourceIndex为0, HEAD标签的为1, BODY标签为2, HEAD的第一个子元素为3

//Compare Position - MIT Licensed, John Resig
function comparePosition(a,b) {
    return a.compareDocumentPosition ? a.compareDocumentPosition(b) : 
    a.contains ? (a != b && a.contains(b) && 16) + 
        (a != b && b.contains(a) && 8) +
        (a.sourceIndex >=0 && b.sourceIndex >= 0 ?
            (a.sourceIndex < b.sourceIndex && 4) + 
            (a.sourceIndex > b.sourceIndex && 2) : 1) : 0;
}

/**
 * 5.4.3节点排序与去重
 */

 //为了让选择器引擎搜到的记过尽可能接近原生API的结果,需要让元素节点按他们在DOM树的出现的顺序排序
 //在IE和Opera早期中, 可以使用sourceIndex进行排序
 //标准浏览器可以使用compareDocumentPosition.只要他们的结果按位与4不等于0就知道其先后顺序了
 //此外,标准浏览器的Range对象有一个compareBoundaryPoints方法,它也能迅速得到两个元素的前后顺序

 var range1 = document.createRange();
 range1.selectNode(document.documentElement);
 var range2 = document.createRange();
 range2.selectNode(document.body);

 var compare = range1.compareBoundaryPoints(Range.START_TO_START, range2);

 //其值可能为1 0 -1 代表(0为相等 1为range1在range2之后  -1位range1在range2之前);


 //特殊的情况发生于要兼容旧版本标准浏览器与XML文档时, 这时只有一些很基础的DOM API, 我们需要使用nextSibling来判断谁是哥哥,谁是弟弟
 //最直观也是最笨的方法是, 不断向上获取他们的父节点, 直到HTML元素联通最初的那个节点组成两个数组, 直到HTML连同最初的那个节点组成两个数组
 //然后每次取数组最后的元素进行比较, 如果相同就去掉, 一直去掉到不同位置, 最后用nextSibling结束
 //下面是测试代码
 window.onload = function() {
    function shuffle(a) {
        //洗牌
        var array = a.concat();
        var i = array.length;
        while(i) {
            var j = Math.floor(Math.random() * i);
            var t = array[--i];
            array[i] = array[j];
            array[j] = t;
        }
        return array;
    }

    var log = function(s) {
        //查看调试信息
        window.console && window.console.log(s)
    }

    var sliceNodes = function(arr) {
        //将NodeList转换为数组
        var ret = [],
            i = arr.length;
        while(i) {
            ret[--i] = arr[i];
            return ret;
        }
    }

    var sortNodes = function(a, b) {
        //节点排序
        var p = 'parentNode',
            ap = a[p],
            bp = b[p];
        if (a === b) {
            return 0;
        } else if (ap === bp) {
            while (a = a.nextSibling) {
                if (a === b) {
                    return -1;
                }
            }
            return 1
        } else if (!ap) {
            return -1;
        } else if (!bp) {
            return 1;
        }

        //不断往上取, 一直到html
        var a1 = [],
            ap = a;
        while (ap && ap.nodeType === 1) {
            a1[a1.length] = ap;
            ap = ap[p]
        }
        var b1 = [],
            bp = b;
        while (bp && bp.nodeType === 1) {
            b1[b1.length] = bp;
            bp = bp[p];
        }
        //然后逐一去掉公共祖先
        ap = a1.pop();
        bp = b1.pop();
        
        while (ap === bp) {
            ap = a1.pop();
            bp = b1.pop();
        }

        if (ap && bp) {
            while (ap = ap.nextSibling) {
                if (ap === bp) {
                    return -1
                }
            }
            return 1;
        }
        return ap ? 1 : -1;
    }
 }
 

 //Mootools的Slick引擎, 它的比较函数已经注明是来自Sizzle的
 features.documentSorter = (root.compareDocumentPosition) ? function(a, b) {
    if (!a.compareDocumentPosition || !b.compareDocumentPosition)
        return 0;
    return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
 } : ('sourceIndex' in root) ? function(a, b) {
    if (!a.sourceIndex || !b.sourceIndex) 
        return 0;
    return a.sourceIndex - b.sourceIndex;
 } : (document.createRange) ? function(a ,b) {
    if (!a.ownerDocument || !b.ownerDocument)
        return 0;
    var aRange = a.ownerDocument.createRange(),
        bRange = b.ownerDocument.createRange();
    //这选的范围前后是重合的可以理解为 比谁的开始标签在前面
    //Range.START_TO_END这个常量其实哪个都行
    aRange,setStart(a, 0);
    aRange.setEnd(a, 0);
    bRange.setStart(b, 0);
    bRange.setEnd(b, 0);
    return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
 } : null;

 //他没打算支持XML和旧版本浏览器, 不支持就不排序


//mass Framework的Icarus引擎, 它结合了一位编程高手JK给出的算法,在排序去重上原生Sizzle
//突破点在于, 无论Sizzle或者Slick,他们都是通过传入比较函数进行排序
//而数组的原生sort方法, 当它传入一个比较函数式, 不管它内部用那种排序算法, 都需要多次比对, 所以非常耗时
//如果能设计让排序在不传参的情况进行, 那么速度会提高

//下面是思路(当然只能用于IE和早期Opera)
//1.取出元素节点的sourceIndex值, 转换成String对象
//2.将元素节点附在String对象上
//3.用String对象组成数组
//4.用原生的sort进String对象数组排序
//5.用排好序的String数组中, 按序取出元素节点, 即可得到排好序的结果集

function unique(nodes) {
    if (nodes.length < 2) {
        return nodes;
    }
    var result = [],
        array = [],
        uniqResult = [],
        node = nodes[0],
        index, ri = 0,
        sourceIndex = typeof node.sourceIndex === 'number',
        compare = typeof node.compareDocumentPosition === 'function';
    //如果支持sourceIndex, 我们将使用更为高效的节点排序
    if (!sourceIndex && !compare) {
        //用于旧版本IE的XML
        var all = (node.ownerDocument || node).getElementsByTagName("*");
        for (var index = 0; node = all[index]; i++) {
            node.setAttribute('sourceIndex', index);
        }
        sourceIndex = true;
    }

    if (sourceIndex) {
        for (var i = 0, n = nodes.length; i < n; i++) {
            node = nodes[i];
            index  = (node.sourceIndex || node.getAttribute('sourceIndex')) + 1e8;
            if (!uniqResul[index]) {        //去重
                (array[ri++] = new String(index))._ = node;
                uniqResult[index] = 1 
            }
        }
        array.sort();
        while (ri) {
            result[--ri] = array[ri]._;
        }
        return result;
    } else {
        nodes.sort(sortOrder);          //排序
        if (sortOrder.hasDuplicate) {   //去重
            for (i = 1; i < nodes.length; i++) {
                if (nodes[i] === nodes[i - 1]) {
                    nodes.splice(i--, 1);
                }
            }
            sortOrder.hasDuplicate = false; //还原
            return nodes;
        }
    }
}

function sortOrder(a, b) {
    if (a === b) {
        sortOrder.hasDuplicate = true;
        return 0;
    }
    if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
        return a.compareDocumentPosition ? -1 : 1;
    }
    return a.compareDocumentPosition(b) & 4 ? -1 : 1;
}

/**
 * 5.4.4切割器
 * 选择器降低了JavaScript的入行门槛, 它们在选择元素时非常随意 一级级地往上加ID类名,导致选择符非常长
 * 因此如果不支持querySelectorAll, 没有一个原生API能承担这个工作
 * 因此我们通常使用正常用户的选择符进行切割
 * 这个不走有点像编译原理的词法分析, 拆分出有用的符号法出来
 * 这里拿Icarus的切割器来举例子, 他是怎么一步步进化, 就知道这工作需要多细致
 */

var icarus = /[\w\u00a1-\uFFFF][\w\u00a1-\uFFFF-]*|[#.:\[][\w\(\)\]]+|\s*[>+~,*]\s*|\s+/g;
//           <--           标签选择器           --><--ID, 类, 伪类,    <亲子, 相邻,   <后代选择器>
//                                                  属性, 第一个字符-->  兄长, 并联 >

//比如 .td1,div a,body 上面的正则可以完美将它分解为如下数组
['.td1', ',', 'div', ' ', 'a', ',', 'body'];

//然后就可以根据这个符号流进行工作
//由于没有指定上下文对象, 就从document开始,发现第一个是类选择器, 可以用getElementByClassName, 如果没有原生的可以梵高
//然后是并联选择器, 将上面得到的元素放进结果集
//接着是标签选择器, 使用getElementByTagName
//接着发现后代选择器, 这里可以优化,我们可以预先查看一下选择器群组是什么, 如果是通配符选择器, 可以继续使用getElementByTagName
//接着又是并联选择器,将上面结果放入结果集.
//最后是标签选择器, 又使用getElementsByTagName
//最后是重排序

//遇到这样一个选择符 :nth-child(2n+1)
//让小括号里面的东西不被切割
var icarus = /[\w\u00a1-\uFFFF][\w\u00a1-\uFFFF-]*|[#.:\[](?:[\w\u00a1-\uFFFF-]|\([^\)]*\)|\])+|(?:\s*)[>+~,*](?:\s*)|\s+/g;

//添加测试样例, 发现.td1[aa='>111'],属性选择器被拆碎了

['.td1', '[aa', '>', '111']

//确保属性选择器作为一个完整的词素
var icarus = /[\w\u00a1-\uFFFF][\w\u00a1-\uFFFF-]|[#.:](?:[\w\u00a1-\uFFFF-]|\S*\([^\)]*\))+|\[[^\]]*\]|(?:\s*)[>+~,*](?:\s*)|\s+/g
