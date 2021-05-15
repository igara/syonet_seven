import { start } from "@www/app";
import serverlessExpress from "@vendia/serverless-express";

exports.handler = start().then(app => {
  serverlessExpress({ app });
});
