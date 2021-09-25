import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import * as awsServerlessExpress from "aws-serverless-express";
import express from "./express";
import apollo from "./apollo";
import { connection as connectionTypeORM } from "@api/models/typeorm/connection";

export const expressHandler: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  connectionTypeORM().then(() => {
    const app = express();
    const server = awsServerlessExpress.createServer(app);
    awsServerlessExpress.proxy(server, event, context);
  });
};

export const apolloHandler = (event: any, context: any, callback: any) => {
  connectionTypeORM().then(() => {
    // @ts-ignore
    apollo().then((handler) => handler(event, context, callback));
  });
};
