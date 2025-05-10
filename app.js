if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/leaflog/sw.js', {
        scope: '/leaflog/'
    });
}
