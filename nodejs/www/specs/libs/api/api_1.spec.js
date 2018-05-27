// @flow

import {getApiHost} from '../../../libs/api'

describe('getApiHost', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('host - http://localhost:3000', async () => {
		expect(getApiHost()).toBe('http://localhost:3000')
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
