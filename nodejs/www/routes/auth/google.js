// @flow
import express from 'express'
// $FlowFixMe
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
// $FlowFixMe
import passport from 'passport'
import User from '../../models/user'
import Session from '../../models/session'
const router = express.Router()

/**
 * Google API設定
 */
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK,
			accessType: 'offline',
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
 * @param {Request} req
 * @param {Response} res
 * $FlowFixMe
 */
export const google = async (req: express$Request, res: express$Response) => {
	const userModel = new User()
	await userModel.upsertByAuthUser(req.user)
	res.redirect('/login/check/')
}
router.get('/callback', passport.authenticate('google'), google)

export default router
