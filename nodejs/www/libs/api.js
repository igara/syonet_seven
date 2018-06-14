// @flow

import 'isomorphic-fetch'
import { getEnvByHostname } from './env'

/**
 * Apiを叩く時のホスト名を取得する
 */
export const getApiHost = (): string => {
	let host = `${location.protocol}//${location.host}`
	if (getEnvByHostname(location.hostname) === 'local') {
		host = host !== 'about://' ? host : 'http://127.0.0.1:3000'
	}
	return host
}

/**
 * APIにリクエストする
 * @param {String} option.url
 * @param {{}} option.body
 * @param {String} option.method
 * @param {String} option.sessionId
 * @return {fetch}
 */
export const call = async (option: APICallParamOption) => {
	option.method = option.method ? option.method : 'POST'
	return await fetch(option.url, {
		body: JSON.stringify(option.body),
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: option.method,
		mode: 'cors',
	})
}
