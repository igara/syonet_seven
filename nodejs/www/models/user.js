// @flow
import mongo from './index'

const UserSchema = mongo.Schema(
	{
		auth: mongo.Schema.Types.Mixed,
		date: Date,
	},
	{collection: 'users'}
)

/**
 * 認証したユーザの情報を更新もしくは新規作成する
 * @param {UpsertByAuthUserParam} user
 * @return {UpsertByAuthUserReturn} findResult
 */
UserSchema.methods.upsertByAuthUser = async(user: UpsertByAuthUserParam): Promise<UpsertByAuthUserReturn> => {
	await User.update(
		{'auth.id': user.id, 'auth.provider': user.provider},
		{$set: {auth: user}},
		{upsert: true}
	)
	const findResult = await User.findOne({
		'auth.id': user.id,
		'auth.provider': user.provider,
	}).exec()
	return findResult
}

/**
 * 認証したユーザから厳選した情報を取得する
 * @param {String} id
 * @param {String} provider
 * @return {Promise<?GetUserInfoReturn>}
 */
UserSchema.methods.getUserInfo = async (id: string, provider: string): Promise<?GetUserInfoReturn> => {
	const user: UserInfoData = await User.findOne({
		'auth.id': id,
		'auth.provider': provider,
	}).exec()
	if (user.auth.provider === 'google') {
		return {
			displayName: user.auth.displayName,
			image: user.auth.photos[0].value,
		}
	} else if (user.auth.provider === 'facebook') {
		return {
			displayName: user.auth.displayName,
			image: user.auth.photos[0].value,
		}
	} else if (user.auth.provider === 'twitter') {
		return {
			displayName: user.auth.displayName,
			image: user.auth.photos[0].value,
		}
	} else if (user.auth.provider === 'github') {
		return {
			displayName: user.auth.displayName,
			image: user.auth.photos[0].value,
		}
	}
	return null
}

const User: UserModelType = mongo.model('User', UserSchema)
export default User
