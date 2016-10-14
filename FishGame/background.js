chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        left: 100,
        top: 100,
        type: 'shell'
    });
});