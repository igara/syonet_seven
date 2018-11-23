// @flow

import { callWebpushKey, callRegistWebpush } from '../fetchs/webpush'

/**
 * Base64 エンコードからバイナリ形式に変換する
 */
const urlsafeBase64ToBinary = urlsafeBase64 => {
	const base64 = urlsafeBase64.replace(/-/g, '+').replace(/_/g, '/')

	const raw = window.atob(base64)
	const binary = new Uint8Array(raw.length)

	for (let i = 0, len = binary.length; i < len; i++) {
		binary[i] = raw.charCodeAt(i)
	}

	return binary
}

/**
 * ArrayBuffer から Base64 エンコードに変換する
 */
const arrayBufferToBase64 = arrayBuffer => {
	return window
		.btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
}

;(async () => {
	if (navigator.serviceWorker) {
		if (location.href) {
			let swFile = '/service-worker.js'
			let scope = '/'

			try {
				// $FlowFixMe
				await navigator.serviceWorker.register(swFile, { scope })
				const cache = await caches.open(`sw-precache-v3-www-${location.href}`)
				const requests = await cache.keys()
				requests.forEach(async request => {
					if (request.url.match(/notification/)) {
						if (
							typeof Notification !== 'undefined' &&
							typeof Notification.requestPermission !== 'undefined'
						) {
							const permission = await Notification.requestPermission()
							switch (permission) {
								case 'granted': {
									// 許可された場合
									// $FlowFixMe
									const registration = await navigator.serviceWorker.register(
										request.url,
										{
											scope: '/syonet/',
										},
									)
									if (typeof navigator.serviceWorker === 'undefined') {
										throw new Error('sw registration')
									}
									const res = await callWebpushKey()
									const applicationServerKey = urlsafeBase64ToBinary(
										res.publicKey,
									)
									const subscription = await registration.pushManager.subscribe(
										{
											userVisibleOnly: true,
											applicationServerKey,
										},
									)

									const notification = {
										endpoint: subscription.endpoint,
										auth: arrayBufferToBase64(subscription.getKey('auth')),
										p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
									}
									await callRegistWebpush(notification)
									break
								}
								case 'denied': {
									// ブロックされた場合
									break
								}
								case 'default': {
									// 無視された場合
									break
								}
								default: {
									break
								}
							}
						}
					}
				})
			} catch (error) {
				console.error(error)
			}
		}
	}
})()
