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
		Object.defineProperty(location, 'protocol', {
			writable: true,
			value: 'https:',
		})
		Object.defineProperty(location, 'host', {
			writable: true,
			value: 'syonet.work',
		})
		Object.defineProperty(location, 'hostname', {
			writable: true,
			value: 'syonet.work',
		})
		expect(getApiHost()).toBe('https://syonet.work')
	})
})
