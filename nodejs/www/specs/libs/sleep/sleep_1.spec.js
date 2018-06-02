// @flow

import {sleep} from '../../../libs/sleep'

describe('sleep', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('sleep - 500ms', async () => {
		const startTime = new Date()
		await sleep(500)
		const endTime = new Date()
		const time = endTime - startTime
		expect(time >= 500).toBe(true)
	})
	test('sleep - 1000ms', async () => {
		const startTime = new Date()
		await sleep(1000)
		const endTime = new Date()
		const time = endTime - startTime
		expect(time >= 1000).toBe(true)
	})
})
