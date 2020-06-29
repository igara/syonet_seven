import express from "express";
import { Strategy as GithubStrategy } from "passport-github";
import passport from "passport";
import { connect as connectTypeORM } from "@www/models/typeorm/connection";
import { Auth } from "@www/models/typeorm/entities/auth";
import { AuthGitHub } from "@www/models/typeorm/entities/auth_github";
import { AccessToken } from "@www/models/typeorm/entities/access_token";
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
  const connect = await connectTypeORM();
  Auth.useConnection(connect);
  AuthGitHub.useConnection(connect);
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

    const findAuth = await AuthGitHub.findOne({ snsID });
    if (findAuth) {
      await AuthGitHub.update(
        {
          id: findAuth.id,
        },
        {
          username,
          imageURL,
        },
      );
    } else {
      const saveAuth = AuthGitHub.create({
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
router.get("/callback", passport.authenticate("github", { session: false }), github);

export default router;
