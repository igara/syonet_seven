const mongo = require('./index')

const UserSchema = mongo.Schema({
	name: String,
})

const User = mongo.model('User', UserSchema)

module.exports = User
