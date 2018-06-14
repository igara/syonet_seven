// @flow

import { getApiHost, call } from '../../../libs/api'

describe('getApiHost', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('host - http://127.0.0.1:3000', async () => {
		expect(getApiHost()).toBe('http://127.0.0.1:3000')
	})
	test('host - https://localhost', async () => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				protocol: 'https:',
				host: 'localhost',
				hostname: 'localhost',
			},
		})
		expect(getApiHost()).toBe('https://localhost')
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
	})
	test('when success', async () => {
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
