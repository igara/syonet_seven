import express from "express";
const app = express();
const router = express.Router();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: express.Request, res: express.Response) => {
  const { method, path, query } = req;

  return res.send(
    JSON.stringify({
      message: "Hello World Serverless!",
      method,
      path,
      query,
    })
  );
});

// Routing
app.use("/", router);

export default app;
