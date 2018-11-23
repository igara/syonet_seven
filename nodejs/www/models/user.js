// @flow
import mongo from './index'

export type UpsertByAuthUserParam = {
	id: string | number,
	provider: string,
}

export type UpsertByAuthUserReturn = {
	_id: string,
	auth: {
		id: string,
		username?: ?string,
		provider: string,
		displayName: string,
		name?: ?{
			familyName: string,
			givenName: string,
		},
		emails?: ?Array<{
			value: string,
			type?: ?string,
		}>,
		_json: {
			image?: {
				url: string,
			},
		},
		photos: Array<{
			value: string,
		}>,
	},
	type: string,
}

export type UserInfoData = {
	_id: string,
	auth: {
		id: string,
		username?: ?string,
		provider: string,
		displayName: string,
		name?: ?{
			familyName: string,
			givenName: string,
		},
		emails?: ?Array<{
			value: string,
			type?: ?string,
		}>,
		_json: {
			image?: {
				url: string,
			},
		},
		photos: Array<{
			value: string,
		}>,
	},
	type: string,
}

export type GetUserInfoReturn = {
	displayName: string,
	image: string,
}

export type UserModelType = {
	upsertByAuthUser: UpsertByAuthUserParam => Promise<UpsertByAuthUserReturn>,
	getUserInfo: (string, string) => Promise<GetUserInfoReturn>,
	getIsAdmin: (string, string) => Promise<boolean>,
	getUserCount: () => Promise<number>,
	getUserList: (
		offset: string | number,
		limit: string | number,
	) => Promise<Array<UserInfoData>>,
}

const UserSchema = new mongo.Schema(
	{
		auth: mongo.Schema.Types.Mixed,
		type: {
			type: String,
			default: 'general',
		},
	},
	{ collection: 'users' },
)

/**
 * 認証したユーザの情報を更新もしくは新規作成する
 * @param {UpsertByAuthUserParam} user
 * @return {UpsertByAuthUserReturn} findResult
 */
export const upsertByAuthUser = async (
	user: UpsertByAuthUserParam,
): Promise<UpsertByAuthUserReturn> => {
	await User.update(
		{ 'auth.id': user.id, 'auth.provider': user.provider },
		{ $set: { auth: user } },
		{ upsert: true, setDefaultsOnInsert: true },
	)
	const findResult = await User.findOne({
		'auth.id': user.id,
		'auth.provider': user.provider,
	}).exec()
	return findResult
}

UserSchema.methods.upsertByAuthUser = upsertByAuthUser

/**
 * 認証したユーザから厳選した情報を取得する
 * @param {String} id
 * @param {String} provider
 * @return {Promise<?GetUserInfoReturn>}
 */
export const getUserInfo = async (
	id: string,
	provider: string,
): Promise<?GetUserInfoReturn> => {
	const user: UserInfoData = await User.findOne({
		'auth.id': id,
		'auth.provider': provider,
	}).exec()
	if (
		typeof user === 'undefined' ||
		user === null ||
		typeof user.auth === 'undefined' ||
		user.auth === null
	) {
		return null
	}
	return {
		displayName: user.auth.displayName,
		image: user.auth.photos[0].value,
	}
}

UserSchema.methods.getUserInfo = getUserInfo

/**
 * 認証したユーザから管理者であるかを取得する
 * @param {String} id
 * @param {String} provider
 * @return {Promise<boolean>}
 */
export const getIsAdmin = async (
	id: string,
	provider: string,
): Promise<boolean> => {
	const user: UserInfoData = await User.findOne({
		'auth.id': id,
		'auth.provider': provider,
	}).exec()
	if (
		typeof user === 'undefined' ||
		user === null ||
		typeof user.auth === 'undefined' ||
		user.auth === null
	) {
		return false
	}
	if (user.type === 'admin') {
		return true
	}
	return false
}

UserSchema.methods.getIsAdmin = getIsAdmin

/**
 * @return {Promise<number>}
 */
export const getUserCount = async (): Promise<number> => {
	const count: number = await User.count()
	return count
}

UserSchema.methods.getUserCount = getUserCount

/**
 * @return {Promise<Array<UserInfoData>>}
 */
export const getUserList = async (
	offset: string | number,
	limit: string | number,
): Promise<Array<UserInfoData>> => {
	const userList: Array<UserInfoData> = await User.find({})
		.skip(offset)
		.limit(limit)
	return userList
}

UserSchema.methods.getUserList = getUserList

const User = mongo.model('User', UserSchema)
export default User
