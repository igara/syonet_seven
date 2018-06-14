// @flow

let { Users } = require('../../../models/user/__mocks__/data/user_1')

export const setUsers = (UsersData: Array<UserInfoData>) => {
	Users = UsersData
}

export const getUserInfo = async (
	id: string,
	provider: string,
): Promise<?GetUserInfoReturn> => {
	const user = Users.find(
		user => user.auth.id === id && user.auth.provider === provider,
	)
	if (
		typeof user !== 'undefined' &&
		user !== null &&
		typeof user.auth !== 'undefined' &&
		user.auth !== null
	) {
		return await {
			displayName: user.auth.displayName,
			image: user.auth.photos[0].value,
		}
	}
	return await null
}
