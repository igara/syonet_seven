// @flow

import {getUserToken, getTokenCookie, setTokenCookie} from '../../../libs/token'

import {DateInstance, MockDate} from '../../globals/date'

describe('getUserToken', () => {
	beforeEach(() => {
		jest.resetModules()
		global.Date = DateInstance
	})
	test('user id - 1111', async () => {
		global.Date = MockDate
		expect(getUserToken(1111)).toBe('22c6a3c4a4f4c795021857b42d9d64353a35d4ad6f05cc0e8465c14320ac49d77dff5f1bdb1c397cf8622fcf3500000c9af2ed55338e3f5db40c672a2b27e078')
	})
	test('user id - 1234', async () => {
		global.Date = MockDate
		expect(getUserToken(1234)).toBe('88913eff5805795883ff11dfc1608153c8a24e9d9ca947c3bf24e8e2cf36b928a5cb2861fbd3135714879d366cdc308af29b80d60208fad4b51c3454ed01dd8c')
	})
})

describe('getTokenCookie', () => {
	beforeEach(() => {
		jest.resetModules()
		global.Date = DateInstance
	})
	test('get token cookie - abcd', async () => {
		setTokenCookie('abcd')
		expect(getTokenCookie()).toBe('abcd')
	})
})

describe('setTokenCookie', () => {
	beforeEach(() => {
		jest.resetModules()
		global.Date = DateInstance
	})
	test('set token cookie - abcd', async () => {
		setTokenCookie('abcd')
		expect(getTokenCookie()).toBe('abcd')
	})
})
