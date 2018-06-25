// @flow
// import { authCheck, authDelete } from '../../../routes/api/auth'

// jest.mock('../../../../models/user', () =>
// 	jest.fn(() => ({
// 		getUserInfo: jest.fn().mockImplementation(async (id, provider) => {
// 			const {
// 				getUserInfo,
// 				setUsers,
// 			} = require('../../../models/user/__mocks__/user')
// 			const { Users } = require('../../../models/user/__mocks__/data/user_1')
// 			setUsers(Users)
// 			return await getUserInfo(id, provider)
// 		}),
// 	})),
// )

// jest.mock('../../../../models/session', () =>
// 	jest.fn(() => ({
// 		getSessionBySessionId: jest.fn().mockImplementation(async sessionId => {
// 			const {
// 				getSessionBySessionId,
// 				setSessions,
// 			} = require('../../../models/session/__mocks__/session')
// 			const {
// 				Sessions,
// 			} = require('../../../models/session/__mocks__/data/session_1')
// 			setSessions(Sessions)
// 			return await getSessionBySessionId(sessionId)
// 		}),
// 		deleteSession: jest.fn().mockImplementation(async sessionId => {
// 			const {
// 				deleteSession,
// 				setSessions,
// 			} = require('../../../models/session/__mocks__/session')
// 			const {
// 				Sessions,
// 			} = require('../../../models/session/__mocks__/data/session_1')
// 			setSessions(Sessions)
// 			return await deleteSession(sessionId)
// 		}),
// 	})),
// )

describe('/auth/check', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('tokenがない時', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				getSessionBySessionId: jest.fn().mockImplementation(sessionId => {
					return {
						session: null,
					}
				}),
			})),
		)
		jest.doMock('../../../models/user', () =>
			jest.fn(() => ({
				getUserInfo: jest.fn().mockImplementation((id, provider) => {
					return null
				}),
			})),
		)

		const request = {
			headers: {},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authCheck } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(401)
		expect(response.send.mock.calls[0][0].status).toBe(401)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
	test('空のtokenの時', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				getSessionBySessionId: jest.fn().mockImplementation(sessionId => {
					return {
						session: null,
					}
				}),
			})),
		)
		jest.doMock('../../../models/user', () =>
			jest.fn(() => ({
				getUserInfo: jest.fn().mockImplementation((id, provider) => {
					return null
				}),
			})),
		)

		const request = {
			headers: {
				token: '',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authCheck } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(401)
		expect(response.send.mock.calls[0][0].status).toBe(401)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})

	test('ログイン中のCookieではない場合', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				getSessionBySessionId: jest.fn().mockImplementation(sessionId => {
					return {
						session: {},
					}
				}),
			})),
		)
		jest.doMock('../../../models/user', () =>
			jest.fn(() => ({
				getUserInfo: jest.fn().mockImplementation((id, provider) => {
					return null
				}),
			})),
		)

		const request = {
			headers: {
				token: 'connect.sid=s:2222222222222.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authCheck } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(401)
		expect(response.send.mock.calls[0][0].status).toBe(401)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})

	test('適切なログイン中のCookieである場合', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				getSessionBySessionId: jest.fn().mockImplementation(async sessionId => {
					return {
						session: {
							passport: {
								user: {
									id: 1111111111111,
									provider: 'google',
								},
							},
						},
					}
				}),
			})),
		)
		jest.doMock('../../../models/user', () =>
			jest.fn(() => ({
				getUserInfo: jest.fn().mockImplementation((id, provider) => {
					return null
				}),
			})),
		)

		const request = {
			headers: {
				token: 'connect.sid=s:1111111111111.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authCheck } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authCheck(request, response)
		expect(response.status.mock.calls[0][0]).toBe(401)
		expect(response.send.mock.calls[0][0].status).toBe(401)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})

	test('適切なログイン中のCookieである場合', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				getSessionBySessionId: jest.fn().mockImplementation(async sessionId => {
					return {
						session: {
							passport: {
								user: {
									id: 1111111111111,
									provider: 'google',
								},
							},
						},
					}
				}),
			})),
		)
		jest.doMock('../../../models/user', () =>
			jest.fn(() => ({
				getUserInfo: jest.fn().mockImplementation((id, provider) => {
					return {
						displayName: 'google user',
						image: 'https://lh4.googleusercontent.com/photo.jpg?sz=50',
					}
				}),
			})),
		)

		const request = {
			headers: {
				token: 'connect.sid=s:1111111111111.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authCheck } = require('../../../routes/api/auth')
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

	test('DB error', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				getSessionBySessionId: jest.fn().mockImplementation(() => {
					throw new Error('db error')
				}),
			})),
		)
		jest.doMock('../../../models/user', () =>
			jest.fn(() => ({
				getUserInfo: jest.fn().mockImplementation((id, provider) => {
					return {
						displayName: 'google user',
						image: 'https://lh4.googleusercontent.com/photo.jpg?sz=50',
					}
				}),
			})),
		)

		const request = {
			headers: {
				token: 'connect.sid=s:1111111111111.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authCheck } = require('../../../routes/api/auth')
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
	test('tokenがない時', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				deleteSession: jest.fn(),
			})),
		)

		const request = {
			headers: {},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authDelete } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(500)
		expect(response.send.mock.calls[0][0].status).toBe(500)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})

	test('空のtokenの時', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				deleteSession: jest.fn(),
			})),
		)

		const request = {
			headers: {
				token: '',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authDelete } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(401)
		expect(response.send.mock.calls[0][0].status).toBe(401)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})

	test('存在しないtokenの時', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				deleteSession: jest.fn().mockImplementation(() => {
					return { ok: 0 }
				}),
			})),
		)

		const request = {
			headers: {
				token: 'connect.sid=s:999999999.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authDelete } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(401)
		expect(response.send.mock.calls[0][0].status).toBe(401)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})

	test('ログイン中のtokenではない場合', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				deleteSession: jest.fn().mockImplementation(() => {
					return { ok: 0 }
				}),
			})),
		)

		const request = {
			headers: {
				token: 'connect.sid=s:2222222222222.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authDelete } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(401)
		expect(response.send.mock.calls[0][0].status).toBe(401)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})

	test('適切なログイン中のtokenである場合', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				deleteSession: jest.fn().mockImplementation(() => {
					return { ok: 1 }
				}),
			})),
		)

		const request = {
			headers: {
				token: 'connect.sid=s:1111111111111.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authDelete } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(200)
		expect(response.send.mock.calls[0][0].status).toBe(200)
		expect(response.send.mock.calls[0][0].message).toBe('OK')
	})

	test('DB error', async () => {
		jest.doMock('../../../models', () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn(),
		}))
		jest.doMock('../../../models/session', () =>
			jest.fn(() => ({
				deleteSession: jest.fn().mockImplementation(() => {
					throw new Error('db error')
				}),
			})),
		)
		const request = {
			headers: {
				token: 'connect.sid=s:1111111111111.abcdf',
			},
		}
		const response = {
			status: jest.fn(),
			send: jest.fn(),
		}
		const { authDelete } = require('../../../routes/api/auth')
		// $FlowFixMe
		await authDelete(request, response)
		expect(response.status.mock.calls[0][0]).toBe(500)
		expect(response.send.mock.calls[0][0].status).toBe(500)
		expect(response.send.mock.calls[0][0].message).toBe('NG')
	})
})
