const express = require('express')
const router = express.Router()
const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const datetime = require('../../libs/datetime')
const User = require('../../models/user')

/**
 * Google API設定
 */
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK,
	accessType: 'offline',
}, (accessToken, refreshToken, profile, done) => {
	done(null, profile)
}))

/**
 * Googleの認証に成功した時ユーザの情報を保存する
 */
passport.serializeUser((user, done) => {
	done(null, user)
})
passport.deserializeUser((obj, done) => {
	done(null, obj)
})

/**
 * Googleの認証画面に遷移する
 */
router.get('/', passport.authenticate('google', {
	scope: ['email', 'profile'],
	session: false,
}))

/**
 * 認証完了画面
 */
router.get('/callback', passport.authenticate('google'), async(req, res, next) => {
	const userModel = new User()
	const token = await userModel.upsertByAuthUser(req.user)
	res.redirect(`/login/check/${token}`)
})

module.exports = router
