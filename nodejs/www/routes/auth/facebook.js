// @flow

import express from 'express'
// $FlowFixMe
import { Strategy as FacebookStrategy } from 'passport-facebook'
// $FlowFixMe
import passport from 'passport'
import { dbConnect, dbClose } from '../../models'
import User from '../../models/user'
const router = express.Router()

/**
 * Facebook API設定
 */
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK,
			scope: ['email', 'user_friends', 'user_birthday', 'user_location'],
			profileFields: ['id', 'email', 'displayName', 'name', 'gender', 'photos'],
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
 * facebookの認証画面に遷移する
 */
router.get('/', passport.authenticate('facebook'))

/**
 * 認証完了画面
 * @param {Request} req
 * @param {Response} res
 * $FlowFixMe
 */
export const facebook = async (req: express$Request, res: express$Response) => {
	try {
		await dbConnect()
		const userModel = new User()
		await userModel.upsertByAuthUser(req.user)
		res.redirect('/login/check/')
	} catch (error) {
		console.error(error)
	} finally {
		await dbClose()
	}
}
router.get('/callback', passport.authenticate('facebook'), facebook)

export default router
