import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import next from "next";
import compression from "compression";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
config({ path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  const stream = fs.createWriteStream(`${__dirname}/log.txt`, { flags: "a" });
  server.use(logger("combined", { stream: stream }));

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
