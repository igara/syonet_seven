import * as express from 'express'
import * as path from 'path'
import { dbConnect, dbClose } from '@www/models'
import * as User from '@www/models/user'
import * as Session from '@www/models/session'

const router = express.Router()
const staticDir = path.join(__dirname, '../dist/prod')

/**
 * @param {Request} req
 * @param {Response} res
 */
export const admin = async (req: express.Request, res: express.Response) => {
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
		const session = await Session.getSessionBySessionId(sessionId)
		if (
			session === null ||
			typeof session.session.passport === 'undefined' ||
			session.session.passport === null ||
			typeof session.session.passport.user === 'undefined' ||
			session.session.passport.user === null
		) {
			return res.sendFile(path.join(staticDir, 'syonet/index.html'))
		}
		const id = session.session.passport.user.id
		const provider = session.session.passport.user.provider
		const isAdmin: boolean = await User.getIsAdmin(id, provider)
		if (isAdmin === false) {
			return res.sendFile(path.join(staticDir, 'syonet/index.html'))
		}
	} catch (error) {
		console.error(error)
		return res.sendFile(path.join(staticDir, 'syonet/index.html'))
	} finally {
		await dbClose()
	}
	return res.sendFile(path.join(staticDir, 'admin/index.html'))
}
router.get('/*', admin)

export default router
