// @flow

import express from 'express'
import path from 'path'
// $FlowFixMe
import favicon from 'serve-favicon'
import logger from 'morgan'
// $FlowFixMe
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// $FlowFixMe
import passport from 'passport'
// $FlowFixMe
import compression from 'compression'
// $FlowFixMe
import session from 'express-session'
import connectMongo from 'connect-mongo'
import mongoose from './models'

// API・Page Import
import authApi from './routes/api/auth'
import userApi from './routes/api/user'
import adminUserApi from './routes/api/admin/user'
import adminStatic from './routes/admin_static'
import admin from './routes/admin'
import authFacebook from './routes/auth/facebook'
import authTwitter from './routes/auth/twitter'
import authGoogle from './routes/auth/google'
import authGithub from './routes/auth/github'
import { graphql } from './routes/graphql'

const app = express()

app.use(
	compression({
		threshold: 0,
		level: 9,
		memLevel: 9,
	}),
)

const staticDir = path.join(__dirname, 'dist/prod')

// CORSを許可する
app.use(
	(req: express$Request, res: express$Response, next: express$NextFunction) => {
		res.set('Access-Control-Allow-Origin', '*')
		res.set('Access-Control-Allow-Headers', 'Content-Type')
		res.set('Cache-Control', 'public, max-age=3600')

		if (req.method === 'OPTIONS') {
			res.append('Access-Control-Allow-Headers', 'Token')
			res.set(
				'Access-Control-Allow-Methods',
				req.get('access-control-request-Method'),
			)
			return res.send()
		}
		next()
	},
)

// HTTPの時HTTPSアクセスにリダイレクトする
app.use(
	(req: express$Request, res: express$Response, next: express$NextFunction) => {
		if (isNotLocalEnv() && req.headers['x-forwarded-proto'] !== 'https') {
			// request was via http, so redirect to https
			res.redirect(`https://${req.hostname}${req.url}`)
		} else {
			next()
		}
	},
)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/admin', adminStatic)
app.use(express.static(staticDir))

// graphql
graphql(app)

// API
app.use('/api/auth', authApi)
app.use('/api/user', userApi)
app.use('/api/admin/user', adminUserApi)

// Auth
app.use(passport.initialize())
app.use(passport.session())

const MongoStore = connectMongo(session)
app.use(
	session({
		secret: 'syonet',
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			db: 'session',
			autoRemove: 'interval',
			autoRemoveInterval: 60,
			stringify: false,
		}),
		cookie: {
			httpOnly: false,
			maxAge: 60 * 60 * 1000,
		},
	}),
)

app.use('/auth/facebook', authFacebook)
app.use('/auth/twitter', authTwitter)
app.use('/auth/google', authGoogle)
app.use('/auth/github', authGithub)
app.use('/manage', admin)

app.get('*', (req: express$Request, res: express$Response) => {
	return res.sendFile(path.join(staticDir, 'syonet/index.html'))
})

// catch 404 and forward to error handler
app.use(
	(req: express$Request, res: express$Response, next: express$NextFunction) => {
		const err: Error = new Error('Not Found')
		// $FlowFixMe
		err.status = 404
		next(err)
	},
)

// error handler
app.use(
	(
		err: Error,
		req: express$Request,
		res: express$Response,
		next: express$NextFunction,
	) => {
		// set locals, only providing error in development
		res.locals.message = err.message
		res.locals.error = req.app.get('env') === 'local' ? err : {}
		// render the error page
		// $FlowFixMe
		res.status(err.status || 500)
		return res.sendFile(path.join(staticDir, 'syonet/index.html'))
	},
)

export default app

/**
 * Local環境ではないかを判定する
 * @return {Boolean}
 */
function isNotLocalEnv() {
	return process.env.NODE_ENV === 'production'
}
