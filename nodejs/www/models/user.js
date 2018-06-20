// @flow
import mongo from './index'

const UserSchema = mongo.Schema(
	{
		auth: mongo.Schema.Types.Mixed,
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
		{ upsert: true },
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

const User: UserModelType = mongo.model('User', UserSchema, null, true)
export default User
