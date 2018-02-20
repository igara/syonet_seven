const express = require('express')
const router = express.Router()
const FacebookStrategy = require('passport-facebook').Strategy
const passport = require('passport')
const User = require('../../models/user')

/**
 * Facebook API設定
 */
passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK,
	scope: [
		'email',
		'user_friends',
		'user_birthday',
		'user_location',
	],
	profileFields: [
		'id',
		'email',
		'displayName',
		'name',
		'gender',
		'photos',
	],
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
router.get('/', passport.authenticate('facebook'))

/**
 * 認証完了画面
 * @param {Request} req
 * @param {Response} res
 */
router.get('/callback', passport.authenticate('facebook'), async(req, res) => {
	const userModel = new User()
	const token = await userModel.upsertByAuthUser(req.user)
	res.redirect(`/login/check/${token}`)
})

module.exports = router
