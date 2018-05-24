// @flow

let {Users} = require('../../../models/user/__mocks__/data/user_1')

export const setUsers = (UsersData: Array<UserInfoData>) => {
	Users = UsersData
}

export const getUserInfo = (token: string): ?GetUserInfoReturn => {
	const user = Users.find(user => user.token === token)
	if (
		typeof user !== 'undefined' && user !== null &&
		typeof user.auth !== 'undefined' && user.auth !== null
	) {
		return {
			displayName: user.auth.displayName,
			image: user.auth.photos[0].value,
		}
	}
	return null
}
