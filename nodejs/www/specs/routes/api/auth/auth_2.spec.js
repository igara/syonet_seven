// @flow
import { authCheck, authDelete } from '../../../../routes/api/auth'

jest.mock('../../../../models/user', () =>
	jest.fn(() => ({
		getUserInfo: jest.fn().mockImplementation((sessionId, provider) => {
			throw new Error('Invalid connection state: 500')
		}),
	})),
)

describe('/auth/check', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('DBに接続ができない時', async () => {
		const request = {}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(500)
		expect(response.send.mock.calls[0][0].status).toBe(500)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
})

describe('/auth/delete', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('DBに接続ができない時', async () => {
		const request = {}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(500)
		expect(response.send.mock.calls[0][0].status).toBe(500)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
})
