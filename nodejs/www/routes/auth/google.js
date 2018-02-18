const express = require('express')
const router = express.Router()
const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const User = require('../../models/user')

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK,
	accessType: 'offline',
}, (accessToken, refreshToken, profile, done) => {
	done(null, profile)
}))

passport.serializeUser(async(user, done) => {
	await User.update(
		{'auth.id': user.id, 'auth.provider': user.provider},
		{$set: {auth: user}},
		{upsert: true}
	)
	done(null, user)
})
passport.deserializeUser((obj, done) => {
	done(null, obj)
})

router.get('/', passport.authenticate('google', {
	scope: ['email', 'profile'],
	session: false,
}))

router.get('/callback', passport.authenticate('google'), async(req, res, next) => {
	res.send('1111')
})

module.exports = router
