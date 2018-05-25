// @flow

let {Users} = require('../../../models/user/__mocks__/data/user_1')

export const setUsers = (UsersData: Array<UserInfoData>) => {
	Users = UsersData
}

export const getUserInfo = async (token: string): Promise<?GetUserInfoReturn> => {
	const user = Users.find(user => user.token === token)
	if (
		typeof user !== 'undefined' && user !== null &&
		typeof user.auth !== 'undefined' && user.auth !== null
	) {
		return await {
			displayName: user.auth.displayName,
			image: user.auth.photos[0].value,
		}
	}
	return await null
}

export const deleteToken = async (token: string): Promise<DeleteTokenReturn> => {
	const user = Users.find(user => user.token === token)
	if (
		typeof user !== 'undefined' && user !== null &&
		typeof user.auth !== 'undefined' && user.auth !== null
	) {
		return await { n: 1, nModified: 1, ok: 1 }
	}
	return await { n: 0, nModified: 0, ok: 0 }
}
