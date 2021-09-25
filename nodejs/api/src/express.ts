import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import "@api/passport/jwt";
import authGoogle from "@api/passport/google";
import authGithub from "@api/passport/github";

import ogp from "@api/ogp";

const main = () => {
  const app = express();
  const router = express.Router();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());

  // CORSを許可する
  app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Cache-Control", "public, no-cache");

    if (req.method === "OPTIONS") {
      res.append("Access-Control-Allow-Headers", "authorization");
      res.set(
        "Access-Control-Allow-Methods",
        req.get("access-control-request-Method")
      );
      return res.send();
    }
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/auth/google", authGoogle);
  app.use("/auth/github", authGithub);

  app.use("/ogp", ogp);

  app.get("/", (_: express.Request, res: express.Response) => {
    return res.send(
      JSON.stringify({
        message: "Pong Syonet API.",
      })
    );
  });

  app.use("/", router);

  return app;
};

export default main;
