// @flow

describe('getUserInfo', () => {
	beforeEach(() => {
		jest.resetModules()
	})
	test('User.authのid・providerの指定がない時', async () => {
		const { getUserInfo, setUsers } = require('./__mocks__/user')
		const { Users } = require('./__mocks__/data/user_1')
		setUsers(Users)
		// $FlowFixMe
		const result = await getUserInfo()
		expect(result).toBe(null)
	})
	test('User.authのid・providerの指定があり、DBにも存在する時', async () => {
		const { getUserInfo, setUsers } = require('./__mocks__/user')
		const { Users } = require('./__mocks__/data/user_1')
		setUsers(Users)

		const result = await getUserInfo('1111111111111', 'google')
		expect(result).toEqual({
			displayName: 'google user',
			image: 'https://lh4.googleusercontent.com/photo.jpg?sz=50',
		})
	})
	test('User.authのid・providerの指定があり、DBには存在しない時', async () => {
		const { getUserInfo, setUsers } = require('./__mocks__/user')
		const { Users } = require('./__mocks__/data/user_1')
		setUsers(Users)

		const result = await getUserInfo('1111111111112', 'google')
		expect(result).toBe(null)
	})
})
