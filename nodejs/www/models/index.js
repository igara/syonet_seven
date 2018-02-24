const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mongodb/admin?authMechanism=SCRAM-SHA-1`)

module.exports = mongoose
