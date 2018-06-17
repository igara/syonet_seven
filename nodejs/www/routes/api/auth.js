// @flow

import express from 'express'
import User from '../../models/user'
import Session from '../../models/session'

const router = express.Router()

/**
 * @param {Request} req
 * @param {Response} res
 */
export const authCheck = async (
	req: express$Request,
	res: express$Response,
) => {
	try {
		const sessionId = req.cookies['connect.sid']
			.replace(/^s:/, '')
			.replace(/\.\S*$/, '')
		if (
			typeof sessionId === 'undefined' ||
			sessionId === null ||
			sessionId === ''
		) {
			res.status(405)
			res.send({
				status: 405,
				message: 'NG',
			})
		}
		const sessionModel = new Session()
		const session = await sessionModel.getSessionBySessionId(sessionId)
		if (
			typeof session.session.passport === 'undefined' ||
			session.session.passport === null
		) {
			res.status(200)
			res.send({
				status: 200,
				message: 'OK',
				user: '',
			})
		}
		const id = session.session.passport.user.id
		const provider = session.session.passport.user.provider
		const userModel: UserModelType = new User()
		const userInfo: GetUserInfoReturn = await userModel.getUserInfo(
			id,
			provider,
		)
		res.status(200)
		res.send({
			status: 200,
			message: 'OK',
			user: userInfo,
		})
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
 * @param {Request} req
 * @param {Response} res
 */
export const authDelete = async (
	req: express$Request,
	res: express$Response,
) => {
	try {
		const sessionId = req.cookies['connect.sid']
			.replace(/^s:/, '')
			.replace(/\.\S*$/, '')
		if (
			typeof sessionId === 'undefined' ||
			sessionId === null ||
			sessionId === ''
		) {
			res.status(405)
			res.send({
				status: 405,
				message: 'NG',
			})
		}
		const sessionModel: SessionModelType = new Session()
		const result = await sessionModel.deleteSession(sessionId)
		if (
			typeof result === 'undefined' ||
			result === null ||
			result.n === 0 ||
			result.ok === 0
		) {
			res.status(405)
			res.send({
				status: 405,
				message: 'NG',
			})
		}
		res.status(200)
		res.send({
			status: 200,
			message: 'OK',
		})
	} catch (error) {
		console.error(error)
		res.status(500)
		res.send({
			status: 500,
			message: 'NG',
		})
	}
}
router.delete('/delete', authDelete)

export default router
