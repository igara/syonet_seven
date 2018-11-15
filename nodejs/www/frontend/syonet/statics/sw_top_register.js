// @flow

if ('serviceWorker' in navigator) {
	let swFile = './sw_top.js'
	let scope = '/'

	if (!location.href) {
		swFile = './sw_top.js'
		scope = '/'
	} else {
		swFile = './service-worker.js'
		scope = '/'
	}

	// $FlowFixMe
	navigator.serviceWorker.register(swFile, { scope }).catch(console.error)
}
