const PAGE = 'top'
const CACHE_NAME = `${PAGE}_cache`
const ORIGIN = `${location.protocol}//${location.hostname}${
	location.port ? ':' + location.port : ''
}`
// キャッシュさせたいファイル
const STATIC_FILES = [ORIGIN + '/']
var STATIC_FILE_URL_HASH = {}
STATIC_FILES.forEach(x => {
	STATIC_FILE_URL_HASH[x] = true
})

/**
 * service worker install eventlistener
 */
self.addEventListener('install', event => {
	console.log('install')
	// キャッシュストレージに新しくキー値を設定し作成する
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return Promise.all(
				STATIC_FILES.map(url => {
					return fetch(new Request(url)).then(response => {
						// レスポンスがあった場合、キャッシュに保存を行う
						if (response.ok) {
							return cache.put(response.url, response)
						}
						return Promise.reject(
							'Invalid response.  URL:' +
								response.url +
								' Status: ' +
								response.status,
						)
					})
				}),
			)
		}),
	)
})

/**
 * service worker activate eventlistener
 */
self.addEventListener('activate', event => {
	console.log('activate')
	// キャッシュストレージからキー値を用いてキーに結びつくキャッシュの確認を行う
	event.waitUntil(
		caches
			.keys()
			.then(keys => {
				var promises = []
				return Promise.all(promises)
			})
			.then(() => {
				return self.clients.claim()
			}),
	)
})

/**
 * service worker fetch eventlistener
 */
self.addEventListener('fetch', event => {
	console.log('fetch')
	// キャッシュストレージにあるURLと一致しているか判定
	if (!STATIC_FILE_URL_HASH[event.request.url]) {
		return
	}
	event.respondWith(caches.match(event.request, { cacheName: CACHE_NAME }))
})
