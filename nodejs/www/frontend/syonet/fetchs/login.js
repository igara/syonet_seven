// @flow

import {call, getApiHost} from '../../../libs/api'

/**
 * ログインチェックを行う
 * @param {{}} json
 */
const callLoginCheck = async() => {
	const result = await call({
		url: `${getApiHost()}/api/auth/check`,
		method: 'POST',
		body: {},
	})
	const json = await result.json()
	return json
}

/**
 * ログアウトを行う
 * @param {{}} json
 */
const callLogout = async() => {
	const result = await call({
		url: `${getApiHost()}/api/auth/delete`,
		method: 'DELETE',
		body: {},
	})
	const json = await result.json()
	return json
}

export default {
	callLoginCheck,
	callLogout,
}
