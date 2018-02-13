const express = require('express')
const router = express.Router()
const User = require('../../models/user')

/* GET users listing. */
router.get('/', async(req, res, next) => {
	const user = new User()	
	const userList = await User.find({})
	console.log(userList)
	res.send('respond with a resource')
})

router.post('/create', async(req, res, next) => {
	const user = new User()	
	user.name = ''
	await user.save()
	res.send('respond with a resource')
})

module.exports = router
