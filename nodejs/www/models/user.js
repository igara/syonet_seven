const mongo = require('./index')
const token = require('../libs/token')
const datetime = require('../libs/datetime')

const UserSchema = mongo.Schema({
	auth: mongo.Schema.Types.Mixed,
	token: String,
	date: Date,
})

/**
 * 認証したユーザの情報を更新もしくは新規作成する
 * @param {{}} user
 * @return {String} tokenValue
 */
UserSchema.methods.upsertByAuthUser = async(user) => {
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
 * @param {{}} user
 * @return {String} tokenValue
 */
UserSchema.methods.deleteToken = async(token) => {
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

const User = mongo.model('User', UserSchema)

module.exports = User
