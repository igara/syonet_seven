// @flow

import { dbConnect, dbClose } from '../models'
import Session from '../models/session'
import User from '../models/user'
import NotificationModel from '../models/notification'

import { Sessions } from './testdata/session'
import { Users } from './testdata/user'
import { Notifications } from './testdata/notification'
;(async () => {
	try {
		await dbConnect()
		await Promise.all([
			Session.remove({}),
			User.remove({}),
			NotificationModel.remove({}),
		])
		await Promise.all([
			Session.insertMany(Sessions),
			User.insertMany(Users),
			NotificationModel.insertMany(Notifications),
		])
	} catch (error) {
		console.error(error)
	} finally {
		console.log('import complate testdata ')
		await dbClose()
		process.exit()
	}
})()
