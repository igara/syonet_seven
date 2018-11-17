// @flow

if ('serviceWorker' in navigator) {
	if (!location.href) {
		// $FlowFixMe
		// navigator.serviceWorker
		// 	.register('./sw_top.js', { scope: '/' })
		// 	.catch(console.error)
	} else {
		let swFile = './service-worker.js'
		let scope = '/'
		// $FlowFixMe
		navigator.serviceWorker
			.register(swFile, { scope })
			.then(aaa => {
				caches.open('sw-precache-v3-www-http://localhost:1111/').then(cache => {
					cache.keys().then(console.log)
				})
			})
			.catch(console.error)
		// $FlowFixMe
		// navigator.serviceWorker
		// 	.register('./sw_top.js', { scope: '/' })
		// 	.catch(console.error)
	}
}
