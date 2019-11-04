import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import next from "next";
import passport from "passport";
import compression from "compression";
import session from "express-session";
import connectMongo from "connect-mongo";
import { config } from "dotenv";
import mongoose from "mongoose";
import * as WebSocket from "ws";
import fs from "fs";
import path from "path";
config({ path: path.resolve(__dirname, ".env") });
import authFacebook from "@www/server/passport/facebook";
import authTwitter from "@www/server/passport/twitter";
import authGoogle from "@www/server/passport/google";
import authGithub from "@www/server/passport/github";

import { ssbSocketRoute } from "@www/server/ws/ssb";

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const gamesDir = path.join(__dirname, "./public/games");

app.prepare().then(() => {
  const server = express();
  const ssbWss = new WebSocket.Server({
    port: 9000,
    host: "0.0.0.0",
  });

  const stream = fs.createWriteStream(`${__dirname}/log.txt`, { flags: "a" });
  server.use(logger("combined", { stream: stream }));

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(cookieParser());

  server.use(
    compression({
      threshold: 0,
      level: 9,
      memLevel: 9,
    }),
  );

  // CORSを許可する
  server.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Cache-Control", "public, max-age=3600");

    if (req.method === "OPTIONS") {
      res.append("Access-Control-Allow-Headers", "Token");
      res.set("Access-Control-Allow-Methods", req.get("access-control-request-Method"));
      return res.send();
    }
    next();
  });

  // HTTPの時HTTPSアクセスにリダイレクトする
  server.use((req, res, next) => {
    if (!dev && req.headers["x-forwarded-proto"] !== "https") {
      // request was via http, so redirect to https
      res.redirect(`https://${req.hostname}${req.url}`);
    } else {
      next();
    }
  });

  mongoose.connect(`${process.env.DB_HOST}/syonet`, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const MongoStore = connectMongo(session);
  const cookie = dev
    ? {
        maxAge: 86400 * 1000,
      }
    : {
        maxAge: 86400 * 1000,
        // domain: `.${process.env.WWW_DOMAIN}`,
      };

  server.use(
    session({
      secret: "syonet",
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: "interval",
        autoRemoveInterval: 60,
        stringify: false,
      }),
      resave: false,
      saveUninitialized: true,
      cookie,
    }),
  );

  server.use(passport.initialize());
  server.use(passport.session());
  server.use("/auth/facebook", authFacebook);
  server.use("/auth/twitter", authTwitter);
  server.use("/auth/google", authGoogle);
  server.use("/auth/github", authGithub);

  ssbSocketRoute(ssbWss);

  server.use("/games/ssb", express.static(gamesDir));
  server.all("/games/ssb", (_req, res) => {
    return res.sendFile(path.join(gamesDir, "ssb/index.html"));
  });
  server.all("/notification.js", (_req, res) => {
    return res.sendFile(path.join(__dirname, "dist", "notification.js"));
  });
  server.all("/sw_register.js", (_req, res) => {
    return res.sendFile(path.join(__dirname, "dist", "sw_register.js"));
  });
  server.all("*", (req, res) => {
    if (req.url.includes("/sw")) {
      const filePath = path.join(__dirname, "static", "workbox", "sw.js");
      return app.serveStatic(req, res, filePath);
    } else if (req.url.startsWith("static/workbox/")) {
      return app.serveStatic(req, res, path.join(__dirname, req.url));
    }
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.info(`> Ready on http://localhost:${port}`);
  });
});
