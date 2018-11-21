// @flow

import mongoose from 'mongoose'

if (!global.TEST && !process.env.TEST && process.env.WWW_ENV) {
	mongoose.connect(
		'mongodb://mongodb/syonet',
		{ useNewUrlParser: true },
	)
}

export const dbConnect = async () => {
	if (
		(global.TEST === 'test' || process.env.TEST === 'test') &&
		!process.env.WWW_ENV
	) {
		await mongoose.connect(
			'mongodb://localhost:27017/test',
			{ useNewUrlParser: true },
		)
	} else if (
		(global.TEST === 'test' || process.env.TEST === 'test') &&
		process.env.WWW_ENV
	) {
		await mongoose.connect(
			'mongodb://mongodb/test',
			{ useNewUrlParser: true },
		)
	} else {
		await mongoose.connect(
			'mongodb://mongodb/syonet',
			{ useNewUrlParser: true },
		)
	}
}

export const dbClose = async () => {
	await mongoose.connection.close()
}

export default mongoose
