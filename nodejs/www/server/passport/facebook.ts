import express from "express";
import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { dbConnect, dbClose } from "@www/models";
import * as User from "@www/models/user";

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
      // scope: ['email', 'user_friends', 'user_birthday', 'user_location'],
      profileFields: ["id", "email", "displayName", "name", "gender", "photos"],
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
router.get("/", passport.authenticate("facebook"));

/**
 * 認証完了画面
 */
export const facebook = async (req: express.Request, res: express.Response) => {
  try {
    await dbConnect();
    await User.upsertByAuthUser(req.user);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  } finally {
    await dbClose();
  }
};
router.get("/callback", passport.authenticate("facebook"), facebook);

export default router;
