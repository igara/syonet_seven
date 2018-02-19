import Api from '../../../libs/api'

/**
 * ログインチェックを行う
 * @param {String} token
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

export default {
	callLoginCheck,
}
