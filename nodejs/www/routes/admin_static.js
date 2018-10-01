// @flow

import express from 'express'
import path from 'path'
import { dbConnect, dbClose } from '../models'
import User from '../models/user'
import type { UserModelType } from '../models/user'
import Session from '../models/session'
import type {
	SessionModelType,
	GetSessionBySessionIdReturn,
} from '../models/session'

const router = express.Router()
const staticDir = path.join(__dirname, '../dist/prod')

/**
 * @param {Request} req
 * @param {Response} res
 */
export const adminStatic = async (
	req: express$Request,
	res: express$Response,
	next: express$NextFunction,
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
			return res.sendFile(path.join(staticDir, 'syonet/index.html'))
		}

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
			return res.sendFile(path.join(staticDir, 'syonet/index.html'))
		}
		const id = session.session.passport.user.id
		const provider = session.session.passport.user.provider
		const userModel: UserModelType = new User()
		const isAdmin: boolean = await userModel.getIsAdmin(id, provider)
		if (isAdmin === false) {
			return res.sendFile(path.join(staticDir, 'syonet/index.html'))
		}
	} catch (error) {
		console.error(error)
		return res.sendFile(path.join(staticDir, 'syonet/index.html'))
	} finally {
		await dbClose()
	}
	return next()
}
router.get('/*', adminStatic)

export default router
