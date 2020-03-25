var avalon = {}
function Cache(size) {
    var keys = []
    var cache = {}
    this.get = function(key) {
        return cache[key + ' ']
    }
    this.put = function(key, value) {
        if (keys.push(key) > size) {
            delete cache[keys.shift()]
        }
        return (cache[key + ' '] = value)
    }
    return this
}

var scriptNode = document.createElement('script');
var scriptTypes = avalon.oneObject(['', 'text/javascript', 'text/ecmascript', 'application/ecmascript', 'application/javascript']);
function fixScript(wrapper) {
    var els = wrapper.getElementsByTagName('script');
    if (els.length) {
        for (var i = 0, el; el = els[i++];) {
            if (scriptTypes[el.type]) {
                var neo = scriptNode.cloneNode(false);
                Array.prototype.forEach.call(el.attributes, function(attr) {
                    if (attr && attr.specified) {
                        neo[attr.name] = attr.value
                        neo.setAttribute(attr.name, attr.value)
                    }
                })
                neo.text = el.text;
                el.parentNode.replaceNode(neo, el);
            }
        }
    }
}


var tagHooks = new function () {
    avalon.shadowCopy(this, {
        option: document.createElement('select'),
        thead: document.createElement('table'),
        td: document.createElement('td'),
        area: document.createElement('map'),
        tr: document.createElement('tbody'),
        col: document.createElement('colgroup'),
        legend: document.createElement('fieldset'),
        _default: document.createElement('div'),
        'g': document.createElementNS('http://www.w3org/2000/svg', 'svg'),
    })
    this.optgroup = this.option
    this.tbody = this.tfoot = this.colgroup = this.caption = this.thead
    this.th = this.td
}
var svgHooks = {
    g: tagHooks.g
}
String('circle,defs,ellipse,image,line,path,polygon,polyline,rect,symbol,text,use')
    .replace(avalon.rword, function (tag) {
        svgHooks[tag] = tagHooks.g  // 处理SVG
    })
var rtagName = /<([\w:]+)/
var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
var rhtml = /<|&#?\w+;/
var htmlCache = new Cache(128);
var templateHook = document.createElement('template');

// 如果浏览器不支持HTML5 template元素
if (!/HTMLTemplateElement/.test(templateHook)) {
    templateHook = null;
    avalon.shadowCopy(tagHooks, svgHooks)
}

avalon.parseHTML = function (html) {
    var fragment = document.createDocumentFragment(), firstChild
    if (typeof html !== 'string') {
        return fragment
    }
    if (!rhtml.test(html)) {
        fragment.appendChild(document.createTextNode(html));
        return fragment;
    }
    html = html.replace(rxhtml, '<$1></$2>').trim()
    var hasCache = htmlCache.get(html)
    if (hasCache) return hasCache.cloneNode(true)
    var tag = (rtagName.exec(html) || ['', ''])[1].toLowerCase();
    var wrapper = svgHooks[tag], firstChild;
    if (wrapper) {  // svgHook
        wrapper.innerHTML = html;
    } else if (templateHook) { // templateHook
        templateHook.innerHTML = html
        wrapper = templateHook.content
    } else { // tagHooks
        wrapper = tagHooks[tag] || tagHooks._default;
        wrapper.innerHTML = html
    }
    fixScript(wrapper)
    if (templateHook) {
        fragment = wrapper
    } else { // 将wrapper上的节点转移到文档碎片上
        while(firstChild = wrapper.firstChild) {
            fragment.appendChild(firstChild);
        }
    }
    if (html.length < 1024) {
        htmlCache.put(html, fragment.cloneNode(true))
    }
    return fragment
}