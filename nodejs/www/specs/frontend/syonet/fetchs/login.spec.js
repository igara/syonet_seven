// @flow

describe('callLoginCheck', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('login', async () => {
		jest.doMock('../../../../libs/api', () => ({
			call: jest.fn(() => ({
				json: jest.fn(() => ({
					status: 200,
					user: { id: 1 },
				})),
			})),
			getApiHost: jest.fn(() => 'https://localhost'),
		}))

		const callLoginCheck = require('../../../../frontend/syonet/fetchs/login')
			.callLoginCheck
		const json = await callLoginCheck()
		expect(json).toEqual({
			status: 200,
			user: { id: 1 },
		})
	})
})

describe('callLogout', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('logout', async () => {
		jest.doMock('../../../../libs/api', () => ({
			call: jest.fn(() => ({
				json: jest.fn(() => ({
					status: 200,
				})),
			})),
			getApiHost: jest.fn(() => 'https://localhost'),
		}))

		const callLogout = require('../../../../frontend/syonet/fetchs/login')
			.callLogout
		const json = await callLogout()
		expect(json).toEqual({
			status: 200,
		})
	})
})
