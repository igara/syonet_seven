// @flow

import express from 'express'
import User from '../../models/user'
const router = express.Router()

/**
 * tokenの値をリクエストし認証の確認をする
 * @param {Request} req
 * @param {Response} res
 */
export const authCheck = async(req: express$Request, res: express$Response) => {
	try {
		const headers = req.headers
		const token = headers.token ? headers.token : ''
		if (typeof token === 'undefined' || token === null || token === '') {
			res.status(405)
			res.send({
				status: 405,
				message: 'NG',
			})
		}
		const userModel: UserModelType = new User()
		const userInfo: GetUserInfoReturn = await userModel.getUserInfo(token)
		if (typeof userInfo !== 'undefined' && userInfo !== null) {
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
		console.error(error)
		res.status(500)
		res.send({
			status: 500,
			message: 'NG',
		})
	}
}
router.post('/check', authCheck)

/**
 * tokenの削除を行う
 * @param {Request} req
 * @param {Response} res
 */
export const authDelete = router.delete('/delete', async(req: express$Request, res: express$Response) => {
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

export default router
