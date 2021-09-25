import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import * as awsServerlessExpress from "aws-serverless-express";
import express from "./express";
import AWS from "aws-sdk";
import fetch from "isomorphic-fetch";

export const expressHandler: Handler = (
  event: APIGatewayEvent,
  context: Context
) => {
  const app = express();
  const server = awsServerlessExpress.createServer(app);
  awsServerlessExpress.proxy(server, event, context);
};

enum WebSocketStatus {
  OPEN = 0,
  BATTLE,
  DIE,
  DEAD,
  CLOSE,
}

enum RotationStatus {
  RIGHT = 90,
  LEFT = 270,
}

enum PlayerType {
  MAN = 0,
  CPU,
}

type UserData = {
  id: string;
  name: string;
  webSocketStatus: WebSocketStatus;
  rotationStatus: RotationStatus;
  playerType: PlayerType;
  unixTime: number;
  character: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    w: number;
    x: number;
    y: number;
    z: number;
  };
  inputType: number;
};

export const connectHandler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  if (!connectionId) return;

  const body = event.body as any;
  if (!body) return;
  if (!body.data) return;

  const apiGatewayManagementApi = process.env.IS_OFFLINE
    ? new AWS.ApiGatewayManagementApi({
        region: "localhost",
        endpoint: "http://localhost:9000",
      })
    : new AWS.ApiGatewayManagementApi();

  const dynamodb = process.env.IS_OFFLINE
    ? new AWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:5000",
      })
    : new AWS.DynamoDB.DocumentClient();

  try {
    const rawData = body.data;
    const buffer = Buffer.from(rawData);
    const data = buffer.toString("utf-8");

    const userData: UserData = JSON.parse(data);

    if (userData.webSocketStatus === WebSocketStatus.OPEN) {
      userData.id = connectionId;

      const userDataJsonString = JSON.stringify(userData);

      if (userData.playerType == PlayerType.MAN) {
        const content = `${userData.name} is fighting`;
        const url: string = process.env.DISCORD_WEBHOCK
          ? process.env.DISCORD_WEBHOCK
          : "";
        // const result = await fetch(url, {
        //   body: `{"username":"syonet.work - ssb","content":"${content}"}`,
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   method: "POST",
        // });
        // console.info(result);
      }

      await dynamodb
        .put({
          TableName: "ssbs",
          Item: {
            id: userData.id,
          },
        })
        .promise();

      const result = await dynamodb
        .scan({
          TableName: "ssbs",
        })
        .promise();
      const items = result.Items as [{ id: string }];

      return Promise.all(
        items.map(async (item) => {
          return apiGatewayManagementApi
            .postToConnection({
              ConnectionId: item.id,
              Data: userDataJsonString,
            })
            .promise()
            .then((e) => {
              console.info(e);
            })
            .catch((e) => {
              console.error(e);
            });
        })
      );
    }

    if (userData.webSocketStatus === WebSocketStatus.BATTLE) {
      const userDataJsonString = JSON.stringify(userData);
      const result = await dynamodb
        .scan({
          TableName: "ssbs",
        })
        .promise();
      const items = result.Items as [{ id: string }];

      return Promise.all(
        items.map(async (item) => {
          return apiGatewayManagementApi
            .postToConnection({
              ConnectionId: item.id,
              Data: userDataJsonString,
            })
            .promise();
        })
      );
    }

    if (userData.webSocketStatus === WebSocketStatus.DIE) {
      const userDataJsonString = JSON.stringify(userData);

      if (userData.playerType == PlayerType.MAN) {
        const content = `${userData.name} dead`;
        const url: string = process.env.DISCORD_WEBHOCK
          ? process.env.DISCORD_WEBHOCK
          : "";
        // const result = await fetch(url, {
        //   body: `{"username":"syonet.work - ssb","content":"${content}"}`,
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   method: "POST",
        // });
        // console.info(result);
      }

      const result = await dynamodb
        .scan({
          TableName: "ssbs",
        })
        .promise();
      const items = result.Items as [{ id: string }];

      return Promise.all(
        items.map(async (item) => {
          return apiGatewayManagementApi
            .postToConnection({
              ConnectionId: item.id,
              Data: userDataJsonString,
            })
            .promise();
        })
      );
    }

    if (userData.webSocketStatus === WebSocketStatus.DEAD) {
      const userDataJsonString = JSON.stringify(userData);

      const result = await dynamodb
        .scan({
          TableName: "ssbs",
        })
        .promise();
      const items = result.Items as [{ id: string }];

      return Promise.all(
        items.map(async (item) => {
          return apiGatewayManagementApi
            .postToConnection({
              ConnectionId: item.id,
              Data: userDataJsonString,
            })
            .promise();
        })
      );
    }

    if (userData.webSocketStatus === WebSocketStatus.CLOSE) {
      await dynamodb
        .delete({
          TableName: "ssbs",
          Key: {
            id: userData.id,
          },
        })
        .promise();

      const userDataJsonString = JSON.stringify(userData);
      const result = await dynamodb
        .scan({
          TableName: "ssbs",
        })
        .promise();
      const items = result.Items as [{ id: string }];

      return Promise.all(
        items.map(async (item) => {
          return apiGatewayManagementApi
            .postToConnection({
              ConnectionId: item.id,
              Data: userDataJsonString,
            })
            .promise();
        })
      );
    }
  } catch (error) {
    console.error(error);
  }

  return { message: "no event." };
};

export const disconnectHandler = async (event: APIGatewayEvent) => {
  const connectionId = event.requestContext.connectionId;
  if (!connectionId) return;

  const apiGatewayManagementApi = process.env.IS_OFFLINE
    ? new AWS.ApiGatewayManagementApi({
        region: "localhost",
        endpoint: "http://localhost:9000",
      })
    : new AWS.ApiGatewayManagementApi();

  const dynamodb = process.env.IS_OFFLINE
    ? new AWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:5000",
      })
    : new AWS.DynamoDB.DocumentClient();

  await dynamodb
    .delete({
      TableName: "ssbs",
      Key: {
        id: connectionId,
      },
    })
    .promise();
  return { aaa: 111 };
};
