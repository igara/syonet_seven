import express from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import { dbConnect, dbClose } from "@www/models/mongoose";
import * as User from "@www/models/mongoose/user";
import * as AccessToken from "@www/models/mongoose/access_token";
import { generateAccessToken } from "@www/libs/token";

const router = express.Router();

/**
 * Google API設定
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : "",
      callbackURL: process.env.GOOGLE_CALLBACK ? process.env.GOOGLE_CALLBACK : "",
      // accessType: 'offline',
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
 * Googleの認証画面に遷移する
 */
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile"],
    session: false,
  }),
);

/**
 * 認証完了画面
 */
export const google = async (req: any, res: express.Response) => {
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
router.get("/callback", passport.authenticate("google", { session: false }), google);

export default router;
