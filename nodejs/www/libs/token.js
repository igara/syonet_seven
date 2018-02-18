const crypto = require('crypto')
const datetime = require('./datetime')

/**
 * 認証に用いるTokenを取得する
 * @param {String|Number} userId
 * @return {String} token 
 */
const getUserToken = (userId) => {
	const value = `${userId}_${datetime.getDateTime()}`
	const hash = crypto.createHmac('sha512', value)
	hash.update(value)
	const token = hash.digest('hex')
	return token
}

module.exports = {
	getUserToken,
}
