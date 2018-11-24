// @flow

import { call, getApiHost } from '@www/libs/api'

/**
 * ログインチェックを行う
 * @return {{}} json
 */
export const callLoginCheck = async () => {
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
 * @return {{}} json
 */
export const callLogout = async () => {
	const result = await call({
		url: `${getApiHost()}/api/auth/delete`,
		method: 'DELETE',
		body: {},
	})
	const json = await result.json()
	return json
}
