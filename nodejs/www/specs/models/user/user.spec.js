// @flow

describe('deleteToken', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('tokenがない時', async () => {
		const {deleteToken, setUsers} = require('./__mocks__/user')
		const {Users} = require('./__mocks__/data/user_1')
		setUsers(Users)
		// $FlowFixMe
		const result = await deleteToken()
		expect(result.n).toBe(0)
		expect(result.nModified).toBe(0)
		expect(result.ok).toBe(0)
	})
	test('適切なtokenではない場合', async () => {
		const {deleteToken, setUsers} = require('./__mocks__/user')
		const {Users} = require('./__mocks__/data/user_1')
		setUsers(Users)

		const result = await deleteToken('eeeeeeeeeeeeeeeeee')
		expect(result.n).toBe(0)
		expect(result.nModified).toBe(0)
		expect(result.ok).toBe(0)
	})
	test('適切なtokenである場合', async () => {
		const {deleteToken, setUsers} = require('./__mocks__/user')
		const {Users} = require('./__mocks__/data/user_1')
		setUsers(Users)

		const result = await deleteToken('aaaaaaaaaaaaaaaaaa')
		expect(result.n).toBe(1)
		expect(result.nModified).toBe(1)
		expect(result.ok).toBe(1)
	})
})

describe('getUserInfo', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('tokenがない時', async () => {
		const {getUserInfo, setUsers} = require('./__mocks__/user')
		const {Users} = require('./__mocks__/data/user_1')
		setUsers(Users)
		// $FlowFixMe
		const result = await getUserInfo()
		expect(result).toBe(null)
	})
	test('適切なtokenではない場合', async () => {
		const {getUserInfo, setUsers} = require('./__mocks__/user')
		const {Users} = require('./__mocks__/data/user_1')
		setUsers(Users)

		const result = await getUserInfo('eeeeeeeeeeeeeeeeee')
		expect(result).toBe(null)
	})
	test('適切なtokenである場合', async () => {
		const {getUserInfo, setUsers} = require('./__mocks__/user')
		const {Users} = require('./__mocks__/data/user_1')
		setUsers(Users)

		const result = await getUserInfo('aaaaaaaaaaaaaaaaaa')
		if (typeof result !== 'undefined' && result !== null) {
			expect(result.displayName).toBe('google user')
			expect(result.image).toBe('https://lh4.googleusercontent.com/photo.jpg?sz=50')
		}
	})
})
