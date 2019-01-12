// @flow
import express from 'express'
// $FlowFixMe
import { Strategy as TwitterStrategy } from 'passport-twitter'
// $FlowFixMe
import passport from 'passport'
import { dbConnect, dbClose } from '@www/models'
import User from '@www/models/user'
import type { UserModelType } from '@www/models/user'

const router = express.Router()

/**
 * Twitter API設定
 */
passport.use(
	new TwitterStrategy(
		{
			consumerKey: process.env.TWITTER_CONSUMER_KEY,
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
			callbackURL: process.env.TWITTER_CALLBACK,
			includeEmail: true,
		},
		(accessToken, refreshToken, profile, done) => {
			return done(null, profile)
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
 * twitterの認証画面に遷移する
 */
router.get('/', passport.authenticate('twitter'))

/**
 * 認証完了画面
 * @param {Request} req
 * @param {Response} res
 * $FlowFixMe
 */
export const twitter = async (req: express$Request, res: express$Response) => {
	try {
		await dbConnect()
		const userModel: UserModelType = new User()
		await userModel.upsertByAuthUser(req.user)
		const sid = req.cookies['connect.sid']
		if (typeof sid !== 'undefined' && sid !== null && sid !== '') {
			const sessionId = sid.replace(/\.\S*$/, '')
			const isProduction = process.env.NODE_ENV === 'production'
			const cookie = isProduction
				? {
						domain: `.${process.env.WWW_DOMAIN}`,
						httpOnly: false,
						maxAge: 60 * 60 * 1000,
				  }
				: {
						httpOnly: false,
						maxAge: 60 * 60 * 1000,
				  }
			res.cookie('token', sessionId, cookie)
		}
		res.redirect('/login/check/')
	} catch (error) {
		console.error(error)
	} finally {
		await dbClose()
	}
}
router.get('/callback', passport.authenticate('twitter'), twitter)

export default router
