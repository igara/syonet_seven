const express = require('express')
const router = express.Router()
const User = require('../../models/user')

/**
 * tokenの値をリクエストし認証の確認をする
 * @param {Request} req
 * @param {Response} res
 */
router.post('/check', async(req, res) => {
	try {
		const headers = req.headers
		const token = headers.token ? headers.token : ''
		const user = await User.find({token})
		if (user.length === 1) {
			res.status(200)
			res.send({
				status: 200,
				message: 'OK',
			})
		} else {
			res.status(405)
			res.send({
				status: 405,
				message: 'NG',
			})
		}
	} catch (error) {
		res.status(500)
		res.send({
			status: 500,
			message: 'NG',
		})
	}
})

module.exports = router
