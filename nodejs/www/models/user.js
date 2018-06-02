// @flow
import mongo from './index'
import {getUserToken} from '../libs/token'
import {getMultiFormatDateTime} from '../libs/datetime'

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
	const tokenValue = getUserToken(findResult._id)
	await User.update(
		{
			'auth.id': user.id,
			'auth.provider': user.provider,
		},
		{$set: {
			auth: user,
			token: tokenValue,
			date: getMultiFormatDateTime(),
		}}
	)
	return tokenValue
}

/**
 * 認証したユーザのtokenを削除する
 * @param {String} token
 */
UserSchema.methods.deleteToken = async(token: string): Promise<DeleteTokenReturn> => {
	return await User.update(
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
 * @param {String} token
 * @return {Promise<?GetUserInfoReturn>}
 */
UserSchema.methods.getUserInfo = async (token: string): Promise<?GetUserInfoReturn> => {
	const user: UserInfoData = await User.findOne({token}).exec()
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
