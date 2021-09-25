import express from "express";

const main = () => {
  const app = express();
  const router = express.Router();

  app.get("/", (_: express.Request, res: express.Response) => {
    return res.send(
      JSON.stringify({
        message: "Pong Syonet SSB.",
      })
    );
  });

  app.use("/", router);

  return app;
};

export default main;
