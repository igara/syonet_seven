const mongo = require('./index')
const token = require('../libs/token')

const UserSchema = mongo.Schema({
	auth: mongo.Schema.Types.Mixed,
	token: String,
})

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
	await User.update(
		{
			'auth.id': user.id,
			'auth.provider': user.provider,
		},
		{$set: {
			auth: user,
			token: token.getUserToken(findResult._id),
		}},
		{upsert: true}
	)
}

const User = mongo.model('User', UserSchema)

module.exports = User
