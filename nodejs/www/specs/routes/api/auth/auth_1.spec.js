// @flow
import { authCheck, authDelete } from '../../../../routes/api/auth'

jest.mock('../../../../models/user', () =>
	jest.fn(() => ({
		getUserInfo: jest.fn().mockImplementation(async (id, provider) => {
			const {
				getUserInfo,
				setUsers,
			} = require('../../../models/user/__mocks__/user')
			const { Users } = require('../../../models/user/__mocks__/data/user_1')
			setUsers(Users)
			return await getUserInfo(id, provider)
		}),
	})),
)

jest.mock('../../../../models/session', () =>
	jest.fn(() => ({
		getSessionBySessionId: jest.fn().mockImplementation(async sessionId => {
			const {
				getSessionBySessionId,
				setSessions,
			} = require('../../../models/session/__mocks__/session')
			const {
				Sessions,
			} = require('../../../models/session/__mocks__/data/session_1')
			setSessions(Sessions)
			return await getSessionBySessionId(sessionId)
		}),
		deleteSession: jest.fn().mockImplementation(async sessionId => {
			const {
				deleteSession,
				setSessions,
			} = require('../../../models/session/__mocks__/session')
			const {
				Sessions,
			} = require('../../../models/session/__mocks__/data/session_1')
			setSessions(Sessions)
			return await deleteSession(sessionId)
		}),
	})),
)

describe('/auth/check', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('Cookieがない時', async () => {
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
	test('空なセッションのcookieの時', async () => {
		const request = {
			cookies: {
				'connect.sid': '',
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
	test('ログイン中のCookieではない場合', async () => {
		const request = {
			cookies: {
				'connect.sid': '2222222222222',
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
		expect(response.send.mock.calls[0][0].user).toBe('')
	})
	test('適切なログイン中のCookieである場合', async () => {
		const request = {
			cookies: {
				'connect.sid': '1111111111111',
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
		expect(response.send.mock.calls[0][0].user.image).toBe(
			'https://lh4.googleusercontent.com/photo.jpg?sz=50',
		)
	})
})

describe('/auth/delete', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('cookieがない時', async () => {
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
	test('空なセッションのcookieの時', async () => {
		const request = {
			cookies: {
				'connect.sid': '',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(405)
		expect(response.send.mock.calls[0][0].status).toBe(405)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
	test('存在しないセッションのcookieの時', async () => {
		const request = {
			cookies: {
				'connect.sid': '999999999',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(405)
		expect(response.send.mock.calls[0][0].status).toBe(405)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
	test('ログイン中のCookieではない場合', async () => {
		const request = {
			cookies: {
				'connect.sid': '2222222222222',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(200)
		expect(response.send.mock.calls[0][0].status).toBe(200)
		expect(response.send.mock.calls[0][0].message).toBe('OK')
	})
	test('適切なログイン中のCookieである場合', async () => {
		const request = {
			cookies: {
				'connect.sid': '1111111111111',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(200)
		expect(response.send.mock.calls[0][0].status).toBe(200)
		expect(response.send.mock.calls[0][0].message).toBe('OK')
	})
})
