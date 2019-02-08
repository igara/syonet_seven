import * as mongoose from 'mongoose'

export const dbConnect = async () => {
	if (
		// @ts-ignore: Unreachable code error
		process.env.TEST === 'testdata' ||
		process.env.TEST === 'test'
	) {
		return await mongoose.connect(
			'mongodb://localhost:27017/test',
			// @ts-ignore: Unreachable code error
			{ useNewUrlParser: true },
		)
	} else {
		return await mongoose.connect(
			'mongodb://mongodb/syonet',
			// @ts-ignore: Unreachable code error
			{ useNewUrlParser: true },
		)
	}
}

export const dbClose = async () => {
	return await mongoose.connection.close()
}

export default mongoose
