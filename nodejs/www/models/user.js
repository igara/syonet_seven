const mongo = require('./index')

const UserSchema = mongo.Schema({
	auth: mongo.Schema.Types.Mixed,
})

const User = mongo.model('User', UserSchema)

module.exports = User
