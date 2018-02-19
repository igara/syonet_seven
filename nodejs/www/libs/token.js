const crypto = require('crypto')
const datetime = require('./datetime')
const Cookies = require('js-cookie')

/**
 * 認証に用いるTokenを取得する
 * @param {String|Number} userId
 * @return {String} token
 */
const getUserToken = (userId) => {
	const value = `${userId}_${datetime.getTimeStamp()}`
	const hash = crypto.createHmac('sha512', value)
	hash.update(value)
	const token = hash.digest('hex')
	return token
}

/**
 * Tokenの値を保存する
 * @param {String} token
 */
const setTokenCookie = (token) => {
	Cookies.set('auth_token', token, {
		expires: new Date(datetime.getMultiFormatDateTime({hours: 1})),
	})
}

module.exports = {
	getUserToken,
	setTokenCookie,
}
