import mongoose from 'mongoose'

export const dbConnect = async () => {
	if (
		(global.TEST === 'test' || process.env.TEST === 'test') &&
		!process.env.WWW_ENV
	) {
		await mongoose.connect('mongodb://localhost:27017/test')
	} else if (
		(global.TEST === 'test' || process.env.TEST === 'test') &&
		process.env.WWW_ENV
	) {
		await mongoose.connect('mongodb://mongodb/test')
	} else {
		await mongoose.connect('mongodb://mongodb/syonet')
	}
}

export const dbClose = async () => {
	await mongoose.connection.close()
}

export default mongoose
