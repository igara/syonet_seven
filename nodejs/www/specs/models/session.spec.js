// @flow
import { dbConnect, dbClose } from '../../models'
import Session, {
	getSessionBySessionId,
	deleteSession,
} from '../../models/session'

describe('getSessionBySessionId', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('sessionIdの指定がない時', async () => {
		await dbConnect()
		// $FlowFixMe
		const result = await getSessionBySessionId()
		expect(result).toBe(null)
		await dbClose()
	})
	test('sessionIdの指定がある時 ログイン中である時', async () => {
		await dbConnect()
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
		await dbClose()
	})
	test('sessionIdの指定がある時 ただしログイン中ではない', async () => {
		await dbConnect()
		const result = await getSessionBySessionId('2222222222222')
		if (typeof result !== 'undefined' && result !== null) {
			expect(result._id).toBe('2222222222222')
			expect(result.session.passport).toBe(undefined)
		}
		await dbClose()
	})
})

// describe('deleteSession', () => {
// 	beforeEach(() => {
// 		jest.resetModules()
// 	})
// 	test('Sessionの削除を行う', async () => {
// 		await dbConnect()
// 		await Session.insertMany([{ _id: '999999' }])
// 		const result1 = await Session.findOne({ _id: '999999' }).exec()
// 		expect(result1._id).toBe('999999')
// 		await deleteSession('999999')
// 		const result2 = await Session.findOne({ _id: '999999' }).exec()
// 		expect(result2).toBe(null)
// 		await dbClose()
// 	})
// })
