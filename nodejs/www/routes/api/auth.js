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
			const userModel = new User()
			const userInfo = userModel.getUserInfo(user[0])
			res.status(200)
			res.send({
				status: 200,
				message: 'OK',
				user: userInfo,
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

/**
 * tokenの削除を行う
 * @param {Request} req
 * @param {Response} res
 */
router.delete('/delete', async(req, res) => {
	try {
		const headers = req.headers
		const token = headers.token ? headers.token : ''
		const userModel = new User()
		await userModel.deleteToken(token)
		res.status(200)
		res.send({
			status: 200,
			message: 'OK',
		})
	} catch (error) {
		res.status(500)
		res.send({
			status: 500,
			message: 'NG',
		})
	}
})

module.exports = router
