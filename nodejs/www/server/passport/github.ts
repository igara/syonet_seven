import express from "express";
import { Strategy as GithubStrategy } from "passport-github";
import passport from "passport";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as User from "@www/models/mongoose/user";
import * as AccessToken from "@www/models/mongoose/access_token";
import { generateAccessToken } from "@www/libs/token";

const router = express.Router();

/**
 * Github API設定
 */
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID ? process.env.GITHUB_CLIENT_ID : "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ? process.env.GITHUB_CLIENT_SECRET : "",
      callbackURL: process.env.GITHUB_CALLBACK ? process.env.GITHUB_CALLBACK : "",
    },
    (_accessToken, _refreshToken, profile, done) => {
      done(null, profile);
    },
  ),
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
router.get(
  "/",
  passport.authenticate("github", {
    session: false,
  }),
);

/**
 * 認証完了画面
 */
export const github = async (req: express.Request, res: express.Response) => {
  let query = "";

  try {
    await dbConnect();
    const user = await User.upsertByAuthUser(req.user);
    if (user) {
      const accessToken = generateAccessToken(user._id.toString());
      await AccessToken.upsertAccessTokenByTokenAndUserId(accessToken, user._id);
      query = `?token=${accessToken}`;
    }
  } catch (error) {
    console.error(error);
  } finally {
    await dbClose();
  }
  return res.redirect(`/${query}`);
};
router.get("/callback", passport.authenticate("github", { session: false }), github);

export default router;
