// @flow
import {authCheck} from '../../../../routes/api/auth'

jest.mock('../../../../models/user', (() => (
	jest.fn(() => ({
		getUserInfo: jest.fn().mockImplementation((token) => {
			const {getUserInfo, setUsers} = require('../../../models/user/__mocks__/user')
			const {Users} = require('../../../models/user/__mocks__/data/user_1')
			setUsers(Users)
			return getUserInfo(token)
		}),
	}))
)))

describe('/auth/check', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('headerにtokenがない時', async () => {
		const request = {
			headers: {
				token: null,
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(405)
		expect(response.send.mock.calls[0][0].status).toBe(405)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
	test('適切なtokenではない場合', async () => {
		const request = {
			headers: {
				token: 'eeeeeeeeeeeeeeeeee',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(405)
		expect(response.send.mock.calls[0][0].status).toBe(405)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
	test('適切なtokenである場合', async () => {
		const request = {
			headers: {
				token: 'aaaaaaaaaaaaaaaaaa',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(200)
		expect(response.send.mock.calls[0][0].status).toBe(200)
		expect(response.send.mock.calls[0][0].message).toBe('OK')
		expect(response.send.mock.calls[0][0].user.displayName).toBe('google user')
		expect(response.send.mock.calls[0][0].user.image).toBe('https://lh4.googleusercontent.com/photo.jpg?sz=50')
	})
})
