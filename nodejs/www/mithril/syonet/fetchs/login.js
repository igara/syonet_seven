import Api from '../../../libs/api'

/**
 * ログインチェックを行う
 * @param {String} token
 * @param {{}} json
 */
const callLoginCheck = async(token) => {
	const result = await Api.call({
		url: `${Api.getApiHost()}/api/auth/check`,
		method: 'POST',
		token,
	})
	const json = await result.json()
	return json
}

/**
 * ログアウトを行う
 * @param {String} token
 * @param {{}} json
 */
const callLogout = async(token) => {
	const result = await Api.call({
		url: `${Api.getApiHost()}/api/auth/delete`,
		method: 'DELETE',
		token,
	})
	const json = await result.json()
	return json
}

export default {
	callLoginCheck,
	callLogout,
}
