window.onload = function() {
    var el = document.querySelector('#file')
    var progress = document.querySelector('#progress')
    el.addEventListener('change', function(e) {
        var file = this.files[0];
        if (file) {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/upload', true)
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.setRequestHeader('X-File-name', encodeURIComponent(file.fileName || file.name))
            xhr.setRequestHeader('Content-Type', 'application/octet-stream')
            xhr.send(file)
            xhr.upload.addEventListener('progress', function(e) {
                var done = e.position || e.loaded,
                    total = e.totalSize || e.total
                progress.innerHTML = (Math.floor(done / total * 1000) / 10) + '%'
            }, false)
            xhr.addEventListener('load', function(e) {
                progress.innerHTML = '上传完成'
            }, false)
        }
    }, false)
}