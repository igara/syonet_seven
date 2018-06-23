// @flow

import Stores from '../../../../frontend/syonet/stores'

describe('callLoginCheckApi', () => {
	beforeEach(() => {
		jest.resetModules()
	})

	test('get User', async () => {
		jest.doMock('../../../../frontend/syonet/fetchs/login', () => ({
			callLoginCheck: jest.fn(() => ({
				status: 200,
				user: { id: 1 },
			})),
		}))

		const LoginCheckAction = require('../../../../frontend/syonet/actions/login_check')
			.default
		const loginCheckAction = new LoginCheckAction(Stores)
		Stores.LoginStore.Status(null)
		Stores.LoginStore.User({})
		expect(Stores.LoginStore.Status()).toBe(null)
		expect(Stores.LoginStore.User()).toEqual({})

		await loginCheckAction.callLoginCheckApi()
		expect(Stores.LoginStore.Status()).toBe(200)
		expect(Stores.LoginStore.User()).toEqual({ id: 1 })
	})

	test('failed User', async () => {
		jest.doMock('../../../../frontend/syonet/fetchs/login', () => ({
			callLoginCheck: jest.fn(() => ({
				status: 405,
				user: { id: 1 },
			})),
		}))

		const LoginCheckAction = require('../../../../frontend/syonet/actions/login_check')
			.default
		const loginCheckAction = new LoginCheckAction(Stores)
		Stores.LoginStore.Status(null)
		Stores.LoginStore.User({})
		expect(Stores.LoginStore.Status()).toBe(null)
		expect(Stores.LoginStore.User()).toEqual({})

		await loginCheckAction.callLoginCheckApi()
		expect(Stores.LoginStore.Status()).toBe(405)
		expect(Stores.LoginStore.User()).toEqual({})
	})
})
