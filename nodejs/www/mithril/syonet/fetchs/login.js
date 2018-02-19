import Api from '../../../libs/api'

/**
 * ログインチェックを行う
 * @param {String} token
 */
const callLoginCheck = async(token) => {
	const result = await Api.call({
		url: `${Api.getApiHost()}/api/auth/check`,
		body: {
			token,
		},
		method: 'POST',
	})
	const json = await result.json()
	return json
}

export default {
	callLoginCheck,
}