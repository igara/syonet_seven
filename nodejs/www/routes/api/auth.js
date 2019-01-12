// @flow

import express from 'express'
import { dbConnect, dbClose } from '@www/models'
import User from '@www/models/user'
import type { UserModelType, GetUserInfoReturn } from '@www/models/user'
import Session from '@www/models/session'
import type {
	SessionModelType,
	GetSessionBySessionIdReturn,
} from '@www/models/session'

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
		const token = req.headers['token']
		if (typeof token === 'undefined' || token === null || token === '') {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
		const sessionId = token.replace(/^connect.sid=s:/, '').replace(/\.\S*$/, '')

		await dbConnect()
		const sessionModel: SessionModelType = new Session()
		const session: GetSessionBySessionIdReturn = await sessionModel.getSessionBySessionId(
			sessionId,
		)
		if (
			typeof session.session.passport === 'undefined' ||
			session.session.passport === null ||
			typeof session.session.passport.user === 'undefined' ||
			session.session.passport.user === null
		) {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
		const id = session.session.passport.user.id
		const provider = session.session.passport.user.provider
		const userModel: UserModelType = new User()
		const userInfo: GetUserInfoReturn = await userModel.getUserInfo(
			id,
			provider,
		)
		if (typeof userInfo === 'undefined' || userInfo === null) {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
		const isProduction = process.env.NODE_ENV === 'production'
		const cookie = isProduction
			? {
					domain: `.${process.env.WWW_DOMAIN}`,
					path: '/',
					secure: true,
					httpOnly: false,
					maxAge: 60 * 60 * 1000,
			  }
			: {
					httpOnly: false,
					maxAge: 60 * 60 * 1000,
			  }
		res.cookie('token', sessionId, cookie)
		res.status(200)
		return res.send({
			status: 200,
			message: 'OK',
			user: userInfo,
		})
	} catch (error) {
		console.error(error)
		res.status(500)
		return res.send({
			status: 500,
			message: 'NG',
		})
	} finally {
		await dbClose()
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
		const token = req.headers['token']
		const sessionId = token.replace(/^connect.sid=s:/, '').replace(/\.\S*$/, '')
		if (
			typeof sessionId === 'undefined' ||
			sessionId === null ||
			sessionId === ''
		) {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}

		await dbConnect()
		const sessionModel: SessionModelType = new Session()
		const result = await sessionModel.deleteSession(sessionId)
		if (
			typeof result === 'undefined' ||
			result === null ||
			result.n === 0 ||
			result.ok === 0
		) {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
		res.status(200)
		return res.send({
			status: 200,
			message: 'OK',
		})
	} catch (error) {
		console.error(error)
		res.status(500)
		return res.send({
			status: 500,
			message: 'NG',
		})
	} finally {
		await dbClose()
	}
}
router.delete('/delete', authDelete)

export default router
