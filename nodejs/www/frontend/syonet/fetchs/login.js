// @flow

import {call, getApiHost} from '../../../libs/api'

/**
 * ログインチェックを行う
 * @param {String} token
 * @param {{}} json
 */
const callLoginCheck = async(token: string) => {
	const result = await call({
		url: `${getApiHost()}/api/auth/check`,
		method: 'POST',
		token,
		body: {},
	})
	const json = await result.json()
	return json
}

/**
 * ログアウトを行う
 * @param {String} token
 * @param {{}} json
 */
const callLogout = async(token: string) => {
	const result = await call({
		url: `${getApiHost()}/api/auth/delete`,
		method: 'DELETE',
		token,
		body: {},
	})
	const json = await result.json()
	return json
}

export default {
	callLoginCheck,
	callLogout,
}
