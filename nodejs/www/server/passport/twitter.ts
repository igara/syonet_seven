import express from "express";
import { Strategy as TwitterStrategy } from "passport-twitter";
import passport from "passport";
import { dbConnect, dbClose } from "@www/models";
import * as User from "@www/models/user";

const router = express.Router();

/**
 * Twitter API設定
 */
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY ? process.env.TWITTER_CONSUMER_KEY : "",
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET ? process.env.TWITTER_CONSUMER_SECRET : "",
      callbackURL: process.env.TWITTER_CALLBACK ? process.env.TWITTER_CALLBACK : "",
      includeEmail: true,
    },
    (_accessToken, _refreshToken, profile, done) => {
      return done(null, profile);
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
 * twitterの認証画面に遷移する
 */
router.get("/", passport.authenticate("twitter"));

/**
 * 認証完了画面
 */
export const twitter = async (req: express.Request, res: express.Response) => {
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
router.get("/callback", passport.authenticate("twitter"), twitter);

export default router;
