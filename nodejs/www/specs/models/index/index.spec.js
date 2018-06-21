// @flow
import { dbConnect, dbClose } from '../../../models'

const env = JSON.parse(JSON.stringify(process.env)).WWW_ENV

describe('index', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	afterEach(() => {
		global.TEST = 'test'
		process.env.WWW_ENV = env
	})
	test('test実行時 docker上じゃない想定', async () => {
		global.TEST = 'test'
		process.env.WWW_ENV = ''
		await dbConnect()
		await dbClose()
	})
	test('test実行時 docker上想定', async () => {
		global.TEST = 'test'
		process.env.WWW_ENV = 'local'
		jest.doMock('mongoose', () => ({
			connect: jest.fn(),
		}))
		const mongo = require('../../../models')
		await mongo.dbConnect()
		process.env.WWW_ENV = env
	})
	test('test環境以外', async () => {
		global.TEST = ''
		jest.doMock('mongoose', () => ({
			connect: jest.fn(),
		}))
		const mongo = require('../../../models')
		await mongo.dbConnect()
		await dbClose()
	})
})
