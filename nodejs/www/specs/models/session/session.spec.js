// @flow

describe('getSessionBySessionId', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('sessionIdの指定がない時', async () => {
		const {
			getSessionBySessionId,
			setSessions,
		} = require('./__mocks__/session')
		const { Sessions } = require('./__mocks__/data/session_1')
		setSessions(Sessions)
		// $FlowFixMe
		const result = await getSessionBySessionId()
		expect(result).toBe(null)
	})
	test('sessionIdの指定がある時 ログイン中である時', async () => {
		const {
			getSessionBySessionId,
			setSessions,
		} = require('./__mocks__/session')
		const { Sessions } = require('./__mocks__/data/session_1')
		setSessions(Sessions)
		const result = await getSessionBySessionId('1111111111111')
		if (typeof result !== 'undefined' && result !== null) {
			expect(result._id).toBe('1111111111111')
			if (
				typeof result.session.passport !== 'undefined' &&
				result.session.passport !== null
			) {
				expect(result.session.passport.user.id).toBe('1111111111111')
			}
		}
	})
	test('sessionIdの指定がある時 ただしログイン中ではない', async () => {
		const {
			getSessionBySessionId,
			setSessions,
		} = require('./__mocks__/session')
		const { Sessions } = require('./__mocks__/data/session_1')
		setSessions(Sessions)
		const result = await getSessionBySessionId('2222222222222')
		if (typeof result !== 'undefined' && result !== null) {
			expect(result._id).toBe('2222222222222')
			expect(result.session.passport).toBe(undefined)
		}
	})
})
