// @flow
import express from 'express'
// $FlowFixMe
import { Strategy as GithubStrategy } from 'passport-github'
// $FlowFixMe
import passport from 'passport'
import User from '../../models/user'

const router = express.Router()

/**
 * Github API設定
 */
passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: process.env.GITHUB_CALLBACK,
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
router.get('/', passport.authenticate('github'))

/**
 * 認証完了画面
 * @param {Request} req
 * @param {Response} res
 * $FlowFixMe
 */
export const github = async (req: express$Request, res: express$Response) => {
	const userModel = new User()
	await userModel.upsertByAuthUser(req.user)
	res.redirect('/login/check/')
}
router.get('/callback', passport.authenticate('github'), github)

export default router
