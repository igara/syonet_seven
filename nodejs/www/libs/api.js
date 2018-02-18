const env = require('./env')

/**
 * Apiを叩く時のホスト名を取得する
 */
const getApiHost = () => {
	let host = `${location.protocol}://${location.host}`
	if (env.getEnvByHostname(location.hostname) === 'local') {
		host = 'http://localhost:3000'
	}
	return host
}

/**
 * APIにリクエストする
 * @param {String} option.url
 * @param {{}} option.body
 * @param {String} option.method
 * @return {fetch}
 */
const call = async(option) => {
	option.method = option.method ? option.method : 'POST'
	return await fetch(option.url, {
		body: JSON.stringify(option.body),
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method: option.method,
		mode: 'cors',
	})
}

module.exports = {
	call,
	getApiHost,
}
