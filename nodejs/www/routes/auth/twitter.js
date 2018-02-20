const express = require('express')
const router = express.Router()
const TwitterStrategy = require('passport-twitter').Strategy
const passport = require('passport')
const User = require('../../models/user')

/**
 * Twitter API設定
 */
passport.use(new TwitterStrategy({
	consumerKey: process.env.TWITTER_CONSUMER_KEY,
	consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
	callbackURL: process.env.TWITTER_CALLBACK,
	includeEmail: true,
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
 * twitterの認証画面に遷移する
 */
router.get('/', passport.authenticate('twitter'))

/**
 * 認証完了画面
 * @param {Request} req
 * @param {Response} res
 */
router.get('/callback', passport.authenticate('twitter'), async(req, res) => {
	const userModel = new User()
	const token = await userModel.upsertByAuthUser(req.user)
	res.redirect(`/login/check/${token}`)
})

module.exports = router
