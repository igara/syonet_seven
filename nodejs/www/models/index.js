const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://mongodb/syonet')

module.exports = mongoose
