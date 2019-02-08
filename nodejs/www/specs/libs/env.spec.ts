import { getEnvByHostname } from '@www/libs/env'

describe('getEnvByHostname', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('local - 引数の指定が適当なホスト名な時', async () => {
		expect(getEnvByHostname('examle.com')).toBe('local')
	})
	test('prod - 引数のホスト名指定がsyonet.workの時', async () => {
		expect(getEnvByHostname('syonet.work')).toBe('prod')
	})
})
