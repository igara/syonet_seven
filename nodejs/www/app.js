const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

const syonetStaticDir = path.join(__dirname, 'dist/prod/syonet')
const staticDir = path.join(__dirname, 'dist/prod')

// CORSを許可する
app.use((req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*')
	res.set('Access-Control-Allow-Headers', 'Content-Type')
  
	if (req.method === 'OPTIONS') {
		res.append('Access-Control-Allow-Headers', 'Token')
		res.set('Access-Control-Allow-Methods', req.get('access-control-request-Method'))
		res.send()
		return
	}
	next()
})

// HTTPの時HTTPSアクセスにリダイレクトする
app.use((req, res, next) => {
	if (isNotLocalEnv() && req.headers['x-forwarded-proto'] !== 'https') {
		// request was via http, so redirect to https
		res.redirect(`https://${req.hostname}${req.url}`)
	} else {
		next()
	}
})


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(staticDir))

// API
const userApi = require('./routes/api/user')
app.use('/api/user', userApi)

// Auth
app.use(passport.initialize())
const authGoogle = require('./routes/auth/google')
app.use('/auth/google', authGoogle)

// send all requests to index.html so browserHistory in React Router works
app.get('*', (req, res) => {
	res.sendFile(path.join(syonetStaticDir, 'index.html'))
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'local' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app

/**
 * Local環境ではないかを判定する
 * @return {Boolean}
 */
function isNotLocalEnv() {
	return process.env.NODE_ENV === 'production'
}
