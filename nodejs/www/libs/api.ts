import { getEnvByHostname } from './env'
import * as Cookies from 'js-cookie'

export type APICallParamOption = {
	body: Object | null
	method: string
	url: string
}

/**
 * Apiを叩く時のホスト名を取得する
 */
export const getApiHost = (): string => {
	let host = `${location.protocol}//${location.hostname}`
	if (getEnvByHostname(location.hostname) === 'local') {
		host =
			host !== 'about://'
				? `http://${location.hostname}:3000`
				: 'http://127.0.0.1:3000'
	}
	return host
}

/**
 * APIにリクエストする
 */
export const call = async ({ url, body, method }: APICallParamOption) => {
	const sessionId = Cookies.get('connect.sid')
	const bodyString = body ? JSON.stringify(body) : null
	if (sessionId) {
		return await fetch(url, {
			body: bodyString,
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Token: `connect.sid=${sessionId}`,
			},
			method: method,
			mode: 'cors',
		})
	}
	return await fetch(url, {
		body: bodyString,
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