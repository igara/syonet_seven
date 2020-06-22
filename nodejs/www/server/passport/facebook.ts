import express from "express";
import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { Auth } from "@www/models/typeorm/entities/auth";
import { AuthFacebook } from "@www/models/typeorm/entities/auth_facebook";
import { AccessToken } from "@www/models/typeorm/entities/access_token";
import { generateAccessToken } from "@www/libs/token";

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
    if (!req.user) throw new Error("not user");
    const user = req.user as {
      id: string;
      provider: string;
      displayName: string;
      photos: Array<{
        value: string;
      }>;
    };

    const snsID = user.id.toString();
    const username = user.displayName;
    const imageURL = user.photos[0].value;

    const findAuth = await AuthFacebook.findOne({ snsID });
    if (findAuth) {
      await AuthFacebook.update(
        {
          id: findAuth.id,
        },
        {
          username,
          imageURL,
        },
      );
    } else {
      const saveAuth = AuthFacebook.create({
        snsID: user.id.toString(),
        username: user.displayName,
        imageURL: user.photos[0].value,
      });
      await saveAuth.save();
    }

    const auth = (await Auth.findOne({ snsID })) as Auth;
    const token = generateAccessToken(auth.id.toString());
    const accessToken = AccessToken.create({
      auth,
      token,
    });
    await accessToken.save();
    query = `?token=${token}`;
  } catch (error) {
    console.error(error);
  }
  return res.redirect(`/${query}`);
};
router.get("/callback", passport.authenticate("facebook", { session: false }), facebook);

export default router;
