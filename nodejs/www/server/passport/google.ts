import express from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import { connect as connectTypeORM } from "@www/models/typeorm/connection";
import { Auth } from "@www/models/typeorm/entities/auth";
import { AuthGoogle } from "@www/models/typeorm/entities/auth_google";
import { AccessToken } from "@www/models/typeorm/entities/access_token";
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
    (accessToken, _refreshToken, profile, done) => {
      done(null, { ...profile, accessToken });
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
    scope: [
      "profile",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.metadata",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
    session: false,
  }),
);

/**
 * 認証完了画面
 */
export const google = async (req: express.Request, res: express.Response) => {
  let query = "";
  const connect = await connectTypeORM();
  Auth.useConnection(connect);
  AuthGoogle.useConnection(connect);
  AccessToken.useConnection(connect);

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

    const findAuth = await AuthGoogle.findOne({ snsID });
    if (findAuth) {
      await AuthGoogle.update(
        {
          id: findAuth.id,
        },
        {
          username,
          imageURL,
        },
      );
    } else {
      const saveAuth = AuthGoogle.create({
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
router.get("/callback", passport.authenticate("google", { session: false }), google);

export default router;
