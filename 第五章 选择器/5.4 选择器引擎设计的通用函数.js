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

