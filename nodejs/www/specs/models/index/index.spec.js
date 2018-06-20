// @flow
import { dbConnect, dbClose } from '../../../models'

describe('getSessionBySessionId', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('test実行時', async () => {
		process.env.WWW_ENV = ''
		await dbConnect()
		await dbClose()
	})
	test('test環境以外', async () => {
		process.env.WWW_ENV = 'localhost'
		jest.doMock('mongoose', () => ({
			connect: jest.fn(),
		}))
		const mongo = require('../../../models')
		await mongo.dbConnect()
		await dbClose()
	})
})
