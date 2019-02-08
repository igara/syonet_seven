import * as express from "express";
import { Strategy as GithubStrategy } from "passport-github";
import * as passport from "passport";
import { dbConnect, dbClose } from "@www/models";
import * as User from "@www/models/user";

const router = express.Router();

/**
 * Github API設定
 */
passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID
				? process.env.GITHUB_CLIENT_ID
				: "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET
				? process.env.GITHUB_CLIENT_SECRET
				: "",
			callbackURL: process.env.GITHUB_CALLBACK
				? process.env.GITHUB_CALLBACK
				: ""
		},
		(accessToken, refreshToken, profile, done) => {
			done(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((obj, done) => {
	done(null, obj);
});

/**
 * facebookの認証画面に遷移する
 */
router.get("/", passport.authenticate("github"));

/**
 * 認証完了画面
 */
export const github = async (req: express.Request, res: express.Response) => {
	try {
		await dbConnect();
		await User.upsertByAuthUser(req.user);
		res.redirect("/login/check/");
	} catch (error) {
		console.error(error);
	} finally {
		await dbClose();
	}
};
router.get("/callback", passport.authenticate("github"), github);

export default router;
