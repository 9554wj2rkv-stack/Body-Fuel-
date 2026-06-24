/* Body Fuel Lab — notification service worker.
   Intentionally has NO fetch handler, so it caches nothing and cannot
   serve stale versions of the app. Its only job is to enable
   registration.showNotification() (the API iOS PWAs require) and to
   handle notification taps / postMessage notification requests. */
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cl) {
    for (var i = 0; i < cl.length; i++) { if ('focus' in cl[i]) return cl[i].focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./bodyfuel.html');
  }));
});

self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.type === 'notify') {
    self.registration.showNotification(d.title || 'Rest Complete', {
      body: d.body || '', tag: 'bf-rest', renotify: true, silent: false, requireInteraction: false
    });
  }
});
