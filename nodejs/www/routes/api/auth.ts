import * as express from 'express'
import { dbConnect, dbClose } from '@www/models'
import * as User from '@www/models/user'
import * as Session from '@www/models/session'

const router = express.Router()

export const authCheck = async (
	req: express.Request,
	res: express.Response,
) => {
	try {
		const token = req.headers['token']
		if (typeof token !== 'string' || token === null || token === '') {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
		const sessionId = token.replace(/^connect.sid=s:/, '').replace(/\.\S*$/, '')

		await dbConnect()
		const session = await Session.getSessionBySessionId(sessionId)
		if (
			session === null ||
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
		const userInfo = await User.getUserInfo(id, provider)
		if (typeof userInfo === 'undefined' || userInfo === null) {
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
 */
export const authAdminCheck = async (
	req: express.Request,
	res: express.Response,
) => {
	try {
		const token = req.headers['token']
		if (typeof token !== 'string' || token === null || token === '') {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
		const sessionId = token.replace(/^connect.sid=s:/, '').replace(/\.\S*$/, '')

		await dbConnect()
		const session = await Session.getSessionBySessionId(sessionId)
		if (
			session === null ||
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
		const userInfo = await User.getUserInfo(id, provider)
		if (typeof userInfo === 'undefined' || userInfo === null) {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
		const isAdmin: boolean = await User.getIsAdmin(id, provider)
		if (isAdmin === false) {
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
router.post('/admin/check', authAdminCheck)

/**
 */
export const authDelete = async (
	req: express.Request,
	res: express.Response,
) => {
	try {
		const token = req.headers['token']
		if (typeof token !== 'string' || token === null || token === '') {
			res.status(401)
			return res.send({
				status: 401,
				message: 'NG',
			})
		}
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
		const result = await Session.deleteSession(sessionId)
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
