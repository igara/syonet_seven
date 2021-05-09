import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import next from "next";
import passport from "passport";
import compression from "compression";
import { config } from "dotenv";
// import * as WebSocket from "ws";
import fs from "fs";
import path from "path";
config({ path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`) });
import authFacebook from "@www/server/passport/facebook";
import authGoogle from "@www/server/passport/google";
import authGithub from "@www/server/passport/github";
import "@www/server/passport/jwt";
// import * as discord from "@www/server/discord";
import { graphqlServer } from "@www/server/graphql";
import { connect as connectTypeORM } from "@www/models/typeorm/connection";
// import { ssbSocketRoute } from "@www/server/ws/ssb";

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
  // const ssbWss = new WebSocket.Server({
  //   port: 9000,
  //   host: "0.0.0.0",
  // });

  const stream = fs.createWriteStream(`${__dirname}/log.txt`, { flags: "a" });
  server.use(logger("combined", { stream: stream }));

  server.use(bodyParser.json({ limit: "50mb" }));
  server.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
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
    res.set("Cache-Control", "public, no-cache");

    if (req.method === "OPTIONS") {
      res.append("Access-Control-Allow-Headers", "authorization");
      res.set("Access-Control-Allow-Methods", req.get("access-control-request-Method"));
      return res.send();
    }
    next();
  });

  await connectTypeORM();

  server.use(passport.initialize());
  server.use(passport.session());
  server.use("/auth/facebook", authFacebook);
  server.use("/auth/google", authGoogle);
  server.use("/auth/github", authGithub);

  await graphqlServer(server);

  // ssbSocketRoute(ssbWss);

  // discord.connect();

  server.all("/games/ssb", (_req, res) => {
    return res.redirect("/games/ssb/index.html");
  });
  server.all("/games/ssb/*", (req, res) => {
    return res.sendFile(path.join(__dirname, "public", req.url));
  });
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.info(`> Ready on http://localhost:${port}`);
  });
});
