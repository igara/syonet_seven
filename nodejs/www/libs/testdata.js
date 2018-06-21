// @flow

import { dbConnect, dbClose } from '../models'
import Session from '../models/session'
import User from '../models/user'

import { Sessions } from '../specs/models/session/__mocks__/data/session_1'
import { Users } from '../specs/models/user/__mocks__/data/user_1'
;(async () => {
	try {
		await dbConnect()
		await Promise.all([Session.remove(), User.remove()])
		await Promise.all([Session.insertMany(Sessions), User.insertMany(Users)])
	} catch (error) {
		console.error(error)
	} finally {
		console.log('import complate testdata ')
		await dbClose()
		process.exit()
	}
})()
