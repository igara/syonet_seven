// @flow
import mongo from './index'
import token from '../libs/token'
import datetime from '../libs/datetime'

const UserSchema = mongo.Schema({
	auth: mongo.Schema.Types.Mixed,
	token: String,
	date: Date,
})

/**
 * 認証したユーザの情報を更新もしくは新規作成する
 * @param {UpsertByAuthUserParam} user
 * @return {String} tokenValue
 */
UserSchema.methods.upsertByAuthUser = async(user: UpsertByAuthUserParam): Promise<string> => {
	await User.update(
		{'auth.id': user.id, 'auth.provider': user.provider},
		{$set: {auth: user}},
		{upsert: true}
	)
	const findResult = await User.findOne({
		'auth.id': user.id,
		'auth.provider': user.provider,
	}).exec()
	const tokenValue = token.getUserToken(findResult._id)
	await User.update(
		{
			'auth.id': user.id,
			'auth.provider': user.provider,
		},
		{$set: {
			auth: user,
			token: tokenValue,
			date: datetime.getMultiFormatDateTime(),
		}},
		{upsert: true}
	)
	return tokenValue
}

/**
 * 認証したユーザのtokenを削除する
 * @param {String} token
 */
UserSchema.methods.deleteToken = async(token: string) => {
	await User.update(
		{
			token,
		},
		{$set: {
			token: '',
		}},
		{upsert: true}
	)
}

/**
 * 認証したユーザから厳選した情報を取得する
 * @param {GetUserInfoParam} user
 * @return {GetUserInfoReturn}
 */
UserSchema.methods.getUserInfo = (user: GetUserInfoParam): GetUserInfoReturn | void => {
	if (user.auth.provider === 'google') {
		return {
			displayName: user.auth.displayName,
			image: user.auth._json.image.url,
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
}

const User: UserModelType = mongo.model('User', UserSchema)
export default User
