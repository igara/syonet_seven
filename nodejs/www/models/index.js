import mongoose from 'mongoose'

export const dbConnect = async () => {
	if (process.env.WWW_ENV) {
		await mongoose.connect('mongodb://mongodb/syonet')
	} else {
		await mongoose.connect('mongodb://localhost:27017/test')
	}
}

export const dbClose = async () => {
	await mongoose.connection.close()
}

export default mongoose
