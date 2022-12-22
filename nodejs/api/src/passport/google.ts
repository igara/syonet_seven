import express from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import { Auth } from "@api/models/typeorm/entities/auth";
// import { AuthGoogle } from "@api/models/typeorm/entities/auth_google";
import { AccessToken } from "@api/models/typeorm/entities/access_token";
import { generateAccessToken } from "@api/libs/token";

const router = express.Router();

/**
 * Google API設定
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID
        ? process.env.GOOGLE_CLIENT_ID
        : "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
        ? process.env.GOOGLE_CLIENT_SECRET
        : "",
      callbackURL: process.env.GOOGLE_CALLBACK
        ? process.env.GOOGLE_CALLBACK
        : "",
      // accessType: 'offline',
    },
    (accessToken, _refreshToken, profile, done) => {
      done(null, { ...profile, accessToken });
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
  })
);

/**
 * 認証完了画面
 */
export const google = async (req: express.Request, res: express.Response) => {
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
      accessToken: string;
    };

    const snsID = user.id.toString();
    const username = user.displayName;
    const imageURL = user.photos[0].value;
    const accessToken = user.accessToken;

    const findAuth = await Auth.findOne({ snsID, type: "AuthGoogle" });
    if (findAuth) {
      await Auth.update(
        {
          id: findAuth.id,
        },
        {
          username,
          imageURL,
          accessToken,
        }
      );
    } else {
      const saveAuth = Auth.create({
        snsID,
        username,
        imageURL,
        accessToken,
        type: "AuthGoogle",
      });
      await saveAuth.save();
    }

    const auth = (await Auth.findOne({ snsID })) as Auth;
    const token = generateAccessToken(auth.id.toString());
    const saveAccessToken = AccessToken.create({
      auth,
      token,
    });
    await saveAccessToken.save();
    query = `?token=${token}`;
  } catch (error) {
    console.error(error);
  }
  return res.redirect(`${process.env.WWW_HOST}/${query}`);
};
router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  google
);

export default router;