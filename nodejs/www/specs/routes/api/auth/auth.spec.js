// @flow
import {authCheck} from '../../../../routes/api/auth'

jest.mock('../../../../models/user', () => ({
	find: jest.fn().mockImplementationOnce((token) => {
		const {find, setUsers} = require('../../../models/user/__mocks__/user')
		const {Users} = require('../../../models/user/__mocks__/data/user_1')
		setUsers(Users)
		return find(token)
	}),
}))

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
})
