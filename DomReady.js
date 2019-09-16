function IEContentLoaded(w, fn) {
    var d = w.document, done = false,
        init = function() {
            if (!done) {
                done = true;
                fn();
            }
        }
    (function() {
        try {       //在DOM未建完之前调用元素doScroll抛出错误
            d.documentElement.doScroll('left');
        } catch (e) {   //延迟再试
            setTimeout(arguments.callee, 50);
            return;
        }
        init(); //没有错误则执行用户回调
    })();

    //如果用户在domReady之后板顶这个函数,则立即执行
    d.onreadstatechange = function() {
        if (d.readyState == 'complete') {
            d.onreadstatechange = null;
            init();
        }
    }
}