import mongoose from 'mongoose'
mongoose.Promise = global.Promise
mongoose.connect('mongodb://mongodb/syonet')

export default mongoose
