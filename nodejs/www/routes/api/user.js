// @flow

import express from 'express'
import User from '../../models/user'
const router = express.Router()

/* GET users listing. */
router.get('/', async(req: express$Request, res: express$Response, next) => {
	const user = new User()	
	const userList = await User.find({})
	console.log(userList)
	res.send('respond with a resource')
})

router.post('/create', async(req: express$Request, res: express$Response, next) => {
	const user = new User()	
	user.name = ''
	await user.save()
	res.send('respond with a resource')
})

export default router
