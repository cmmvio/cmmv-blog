window.addEventListener('load', () => {
    const url = new URL(window.location.href);
    const data = new URLSearchParams({
        path: url.pathname,
        t: Date.now().toString(),
        r: Math.random().toString()
    });

    navigator.sendBeacon('/api/analytics/access', data);
});

window.addEventListener('beforeunload', () => {
    const url = new URL(window.location.href);
    const data = new URLSearchParams({
        path: url.pathname,
        t: Date.now().toString(),
        r: Math.random().toString()
    });

    navigator.sendBeacon('/api/analytics/unload', data);
});