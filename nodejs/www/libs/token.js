// @flow
const crypto = require('crypto')
const datetime = require('./datetime')
const Cookies = require('../mithril/syonet/js_cookie')

/**
 * 認証に用いるTokenを取得する
 * @param {String|Number} userId
 * @return {String} token
 */
const getUserToken = (userId: number | string): string => {
	const value = `${userId}_${datetime.getTimeStamp()}`
	const hash = crypto.createHmac('sha512', value)
	hash.update(value)
	const token = hash.digest('hex')
	return token
}

/**
 * 認証に用いるTokenをクッキーから取得する
 * @return {String}
 */
const getTokenCookie = () => {
	return Cookies.get('auth_token')
}

/**
 * Tokenの値を保存する
 * @param {String} token
 */
const setTokenCookie = (token: string) => {
	Cookies.set('auth_token', token, {
		expires: new Date(datetime.getMultiFormatDateTime({hours: 1})),
	})
}

module.exports = {
	getUserToken,
	setTokenCookie,
	getTokenCookie,
}
