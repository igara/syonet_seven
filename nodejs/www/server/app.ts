import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as compression from "compression";
import * as session from "express-session";
import * as connectMongo from "connect-mongo";
import mongoose, { dbConnect } from "@www/server/models";
import * as http from "http";
import * as WebSocket from "ws";

// API Import
import authApi from "./routes/api/auth";
import userApi from "./routes/api/user";
import webpushApi from "./routes/api/webpush";
import adminUserApi from "./routes/api/admin/user";
import googleSpreadSheetApi from "./routes/api/google/spreadsheet";
// Page Import
import adminStatic from "./routes/admin_static";
import admin from "./routes/admin";
import authFacebook from "./routes/auth/facebook";
import authTwitter from "./routes/auth/twitter";
import authGoogle from "./routes/auth/google";
import authGithub from "./routes/auth/github";
import { graphql } from "./routes/graphql";
// WebSocket Import
import { ssbSocketRoute } from "./routes/ws/ssb";

const app = express();
const webSocketServer = http.createServer(app);
webSocketServer.listen(9000);
const wss = new WebSocket.Server({ server: webSocketServer });

/**
 * Local環境ではないかを判定する
 */
const isProduction = process.env.WWW_ENV === "production";

app.use(
	compression({
		threshold: 0,
		level: 9,
		memLevel: 9
	})
);

const staticDir = path.join(__dirname, "../dist/prod");

// CORSを許可する
app.use((req, res, next) => {
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	res.set("Cache-Control", "public, max-age=3600");

	if (req.method === "OPTIONS") {
		res.append("Access-Control-Allow-Headers", "Token");
		res.set(
			"Access-Control-Allow-Methods",
			req.get("access-control-request-Method")
		);
		return res.send();
	}
	next();
});

// HTTPの時HTTPSアクセスにリダイレクトする
app.use((req, res, next) => {
	if (isProduction && req.headers["x-forwarded-proto"] !== "https") {
		// request was via http, so redirect to https
		res.redirect(`https://${req.hostname}${req.url}`);
	} else {
		next();
	}
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/admin", adminStatic);
app.use(express.static(staticDir));

// graphql
graphql(app);

// API
app.use("/api/auth", authApi);
app.use("/api/user", userApi);
app.use("/api/webpush", webpushApi);
app.use("/api/admin/user", adminUserApi);
app.use("/api/google/spreadsheet", googleSpreadSheetApi);

mongoose.connect(
	"mongodb://mongodb/syonet",
	// @ts-ignore: Unreachable code error
	{ useNewUrlParser: true }
);
const MongoStore = connectMongo(session);
const cookie = isProduction
	? {
			httpOnly: false,
			maxAge: 60 * 60 * 1000,
			domain: `.${process.env.WWW_DOMAIN}`
	  }
	: {
			httpOnly: false,
			maxAge: 60 * 60 * 1000
	  };

app.use(
	session({
		secret: "syonet",
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			db: "session",
			autoRemove: "interval",
			autoRemoveInterval: 60,
			stringify: false
		}),
		cookie
	})
);

// Auth
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth/facebook", authFacebook);
app.use("/auth/twitter", authTwitter);
app.use("/auth/google", authGoogle);
app.use("/auth/github", authGithub);

app.use("/manage", admin);

ssbSocketRoute(wss);

app.get("/service-worker.js", (req, res) => {
	return res.sendFile(path.join(staticDir, "syonet/service-worker.js"));
});

app.get("*", (req, res) => {
	return res.sendFile(path.join(staticDir, "syonet/index.html"));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err: Error = new Error("Not Found");
	next(err);
});

// error handler
app.use((req, res, next) => {
	// set locals, only providing error in development
	res.locals.error = {};
	// render the error page
	res.status(404);
	return res.sendFile(path.join(staticDir, "syonet/index.html"));
});

export default app;
