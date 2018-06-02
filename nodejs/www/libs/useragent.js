// @flow

const userAgent = window.navigator.userAgent.toLowerCase()
const ver = window.navigator.appVersion.toLowerCase()

export const browser = () => {
	if (userAgent.indexOf('edge') !== -1) return 'edge'
	else if (userAgent.indexOf('iemobile') !== -1)      return 'iemobile'
	else if (userAgent.indexOf('trident/7') !== -1)     return 'ie11'
	else if (userAgent.indexOf('msie') !== -1 && userAgent.indexOf('opera') === -1) {
		if      (ver.indexOf('msie 6.')  !== -1) return 'ie6'
		else if (ver.indexOf('msie 7.')  !== -1) return 'ie7'
		else if (ver.indexOf('msie 8.')  !== -1) return 'ie8'
		else if (ver.indexOf('msie 9.')  !== -1) return 'ie9'
		else if (ver.indexOf('msie 10.') !== -1) return 'ie10'
	}
	else if (userAgent.indexOf('chrome')  !== -1 && userAgent.indexOf('edge') === -1)   return 'chrome'
	else if (userAgent.indexOf('safari')  !== -1 && userAgent.indexOf('chrome') === -1) return 'safari'
	else if (userAgent.indexOf('opera')   !== -1) return 'opera'
	else if (userAgent.indexOf('firefox') !== -1) return 'firefox'
	else return 'unknown_browser'
}

export const device = () => {
	if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipod') !== -1 ) return 'iphone'
	else if (userAgent.indexOf('ipad')    !== -1) return 'ipad'
	else if (userAgent.indexOf('android') !== -1) return 'android'
	else if (userAgent.indexOf('windows') !== -1 && userAgent.indexOf('phone') !== -1) return 'windows_phone'
	else return ''
}
