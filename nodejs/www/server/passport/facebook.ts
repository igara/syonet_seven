import express from "express";
import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as User from "@www/models/mongoose/user";
import { generateAccessToken } from "@www/libs/token";
import * as AccessToken from "@www/models/mongoose/access_token";

const router = express.Router();

/**
 * Facebook API設定
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID ? process.env.FACEBOOK_APP_ID : "",
      clientSecret: process.env.FACEBOOK_APP_SECRET ? process.env.FACEBOOK_APP_SECRET : "",
      callbackURL: process.env.FACEBOOK_CALLBACK ? process.env.FACEBOOK_CALLBACK : "",
      profileFields: ["id", "displayName", "name", "gender", "photos"],
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
router.get("/", passport.authenticate("facebook", { session: false }));

/**
 * 認証完了画面
 */
export const facebook = async (req: express.Request, res: express.Response) => {
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
router.get("/callback", passport.authenticate("facebook", { session: false }), facebook);

export default router;
