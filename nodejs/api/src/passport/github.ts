import express from "express";
import { Strategy as GithubStrategy } from "passport-github";
import passport from "passport";
import { Auth } from "@api/models/typeorm/entities/auth";
// import { AuthGitHub } from "@api/models/typeorm/entities/auth_github";
import { AccessToken } from "@api/models/typeorm/entities/access_token";
import { generateAccessToken } from "@api/libs/token";

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
        : "",
    },
    (accessToken, _refreshToken, profile, done) => {
      done(null, {
        ...profile,
        accessToken,
      });
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
router.get(
  "/",
  passport.authenticate("github", {
    session: false,
  })
);

/**
 * 認証完了画面
 */
export const github = async (req: express.Request, res: express.Response) => {
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

    const findAuth = await Auth.findOne({ snsID, type: "AuthGithub" });
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
        type: "AuthGithub",
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
  passport.authenticate("github", { session: false }),
  github
);

export default router;
