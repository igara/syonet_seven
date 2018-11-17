// @flow

if (typeof Notification !== 'undefined') {
	Notification.requestPermission().then(permission => {
		switch (permission) {
			case 'granted':
				// 許可された場合
				break
			case 'denied':
				// ブロックされた場合
				break
			case 'default':
				// 無視された場合
				break
			default:
				break
		}
	})
}
