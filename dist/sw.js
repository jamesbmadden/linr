var CACHE = 'linr';

self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
      '/',
      './index.html',
      './main.js',
      './logo/logo-home.png'
    ]);
  }));
});

self.addEventListener('fetch', function(evt) {
  evt.respondWith(fromCache(evt.request).catch(() => {
    fromNetwork(evt.request);
  }).catch(() => {
    fromCache('/');
  }));
  evt.waitUntil(
    update(evt.request)
  );
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}


function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
     var timeoutId = setTimeout(reject, timeout);
     fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
     }, reject);
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}