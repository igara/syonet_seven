// @flow

import express from 'express'
import { dbConnect, dbClose } from '../../models'
import User from '../../models/user'
import type { UserModelType } from '../../models/user'

const router = express.Router()

/* GET users listing. */
router.get('/', async (req: express$Request, res: express$Response, next) => {
	await dbConnect()
	const user: UserModelType = new User()
	const userList = await User.find({})
	console.log(userList)
	await dbClose()
	return res.send('respond with a resource')
})

router.post(
	'/create',
	async (req: express$Request, res: express$Response, next) => {
		const user: UserModelType = new User()
		user.name = ''
		await user.save()
		return res.send('respond with a resource')
	},
)

export default router
