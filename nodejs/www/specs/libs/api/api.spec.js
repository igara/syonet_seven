// @flow

import { getApiHost, call } from '../../../libs/api'
import Cookies from '../../../frontend/syonet/statics/js_cookie'

describe('getApiHost', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('host - http://127.0.0.1:3000', async () => {
		expect(getApiHost()).toBe('http://127.0.0.1:3000')
	})
	test('host - http://localhost:3000', async () => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				protocol: 'http:',
				host: 'localhost',
				hostname: 'localhost',
			},
		})
		expect(getApiHost()).toBe('http://localhost:3000')
	})
	test('host - about://', async () => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				protocol: 'about:',
				host: '',
				hostname: '',
			},
		})
		expect(getApiHost()).toBe('http://127.0.0.1:3000')
	})
	test('host - https://syonet.work', async () => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				protocol: 'https:',
				host: 'syonet.work',
				hostname: 'syonet.work',
			},
		})
		expect(getApiHost()).toBe('https://syonet.work')
	})
})

describe('call', () => {
	beforeEach(() => {
		jest.resetModules()
		Cookies.remove('connect.sid')
	})
	test('has token', async () => {
		const option = {
			body: {},
			method: '',
			url: '',
		}
		Cookies.set('connect.sid', '111111')
		global.fetch = jest.fn().mockImplementation(() => {
			const p = new Promise((resolve, reject) => {
				resolve({
					ok: true,
					status: 200,
					json: () => {
						return new Promise((resolve, reject) => {
							resolve({ Id: 123 })
						})
					},
				})
			})
			return p
		})
		const result = await call(option)
		expect(result.status).toBe(200)
		expect(result.ok).toBe(true)
		const json = await result.json()
		expect(json.Id).toBe(123)
	})

	test('has not token', async () => {
		const option = {
			body: {},
			method: '',
			url: '',
		}
		global.fetch = jest.fn().mockImplementation(() => {
			const p = new Promise((resolve, reject) => {
				resolve({
					ok: true,
					status: 200,
					json: () => {
						return new Promise((resolve, reject) => {
							resolve({ Id: 123 })
						})
					},
				})
			})
			return p
		})
		const result = await call(option)
		expect(result.status).toBe(200)
		expect(result.ok).toBe(true)
		const json = await result.json()
		expect(json.Id).toBe(123)
	})
})
