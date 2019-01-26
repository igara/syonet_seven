import * as express from 'express'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import * as passport from 'passport'
import { dbConnect, dbClose } from '@www/models'
import * as User from '@www/models/user'

const router = express.Router()

/**
 * Google API設定
 */
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID
				? process.env.GOOGLE_CLIENT_ID
				: '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
				? process.env.GOOGLE_CLIENT_SECRET
				: '',
			callbackURL: process.env.GOOGLE_CALLBACK
				? process.env.GOOGLE_CALLBACK
				: '',
			// accessType: 'offline',
		},
		(accessToken, refreshToken, profile, done) => {
			done(null, profile)
		},
	),
)

passport.serializeUser((user, done) => {
	done(null, user)
})
passport.deserializeUser((obj, done) => {
	done(null, obj)
})

/**
 * Googleの認証画面に遷移する
 */
router.get(
	'/',
	passport.authenticate('google', {
		scope: ['email', 'profile'],
		session: false,
	}),
)

/**
 * 認証完了画面
 */
export const google = async (req: express.Request, res: express.Response) => {
	try {
		await dbConnect()
		await User.upsertByAuthUser(req.user)
		res.redirect('/login/check/')
	} catch (error) {
		console.error(error)
	} finally {
		await dbClose()
	}
}
router.get('/callback', passport.authenticate('google'), google)

export default router
