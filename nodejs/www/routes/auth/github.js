const express = require('express')
const router = express.Router()
const FacebookStrategy = require('passport-github').Strategy
const passport = require('passport')
const User = require('../../models/user')

/**
 * Github API設定
 */
passport.use(new FacebookStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.GITHUB_CALLBACK,
}, (accessToken, refreshToken, profile, done) => {
	done(null, profile)
}))

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
 */
router.get('/callback', passport.authenticate('github'), async(req, res) => {
	const userModel = new User()
	const token = await userModel.upsertByAuthUser(req.user)
	res.redirect(`/login/check/${token}`)
})

module.exports = router
