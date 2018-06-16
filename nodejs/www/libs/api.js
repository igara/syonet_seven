// @flow

import 'isomorphic-fetch'
import { getEnvByHostname } from './env'

/**
 * Apiを叩く時のホスト名を取得する
 */
export const getApiHost = (): string => {
	let host = `${location.protocol}//${location.hostname}`
	if (getEnvByHostname(location.hostname) === 'local') {
		host = host !== 'about://' ? `${host}:3000` : 'http://127.0.0.1:3000'
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
export const call = async ({ url, body, method }: APICallParamOption) => {
	return await fetch(url, {
		body: JSON.stringify(body),
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: method,
		mode: 'cors',
	})
}
