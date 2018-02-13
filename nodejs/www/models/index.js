const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://syonet:syonet@mongodb/admin?authMechanism=SCRAM-SHA-1')

module.exports = mongoose
