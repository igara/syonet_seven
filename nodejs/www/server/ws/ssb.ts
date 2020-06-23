import WS from "ws";
import webpush from "web-push";
import { WebPushUser } from "@www/models/typeorm/entities/webpush_user";
import { WebPushMessage } from "@www/models/typeorm/entities/webpush_message";
import fetch from "isomorphic-fetch";

const contact = process.env.WEBPUSH_CONTACT ? process.env.WEBPUSH_CONTACT : "";
const vapidKeys = {
  publicKey: process.env.WEBPUSH_VAPIDKEYS_PUBLIC ? process.env.WEBPUSH_VAPIDKEYS_PUBLIC : "",
  privateKey: process.env.WEBPUSH_VAPIDKEYS_PRIVATE ? process.env.WEBPUSH_VAPIDKEYS_PRIVATE : "",
};

webpush.setVapidDetails(contact, vapidKeys.publicKey, vapidKeys.privateKey);

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
  id: number;
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

export const ssbSocketRoute = (wss: WS.Server) => {
  let userId = 1;

  wss.on("connection", (ws: WS) => {
    ws.on("message", async (message: Buffer | string) => {
      try {
        if (typeof message === "string") {
          return;
        }
        const data = message.toString("utf-8", 0, message.length);
        const userData: UserData = JSON.parse(data);

        if (userData.webSocketStatus === WebSocketStatus.OPEN) {
          userData.id = userId;
          userId += 1;
          const userDataJsonString = JSON.stringify(userData);
          wss.clients.forEach(client => {
            client.send(userDataJsonString);
          });

          if (userData.playerType == PlayerType.MAN) {
            const content = `${userData.name} is fighting`;
            const url: string = process.env.DISCORD_WEBHOCK ? process.env.DISCORD_WEBHOCK : "";
            const result = await fetch(url, {
              body: `{"username":"syonet.work - ssb","content":"${content}"}`,
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "POST",
            });
            console.info(result);

            const title = "ssb";
            const body = content;
            const payload = {
              title,
              body,
              icon: "https://avatars3.githubusercontent.com/u/7006562?s=460&v=4",
              url: `https://${process.env.WWW_DOMAIN}/games/ssb`,
            };
            const sendPayload = JSON.stringify(payload);
            const webPushMessage = WebPushMessage.create({
              title,
              body,
              icon: payload.icon,
              url: payload.url,
            });
            await webPushMessage.save();
            const webPushUsers = await WebPushUser.find();

            await Promise.all(
              webPushUsers.map(webPushUser => {
                const subscription = {
                  endpoint: webPushUser.endpoint,
                  keys: {
                    auth: webPushUser.auth,
                    p256dh: webPushUser.p256dh,
                  },
                };

                // 購読時に, クライアントサイドから取得したエンドポイント URI に対して POST リクエストを送信
                webpush
                  .sendNotification(subscription, sendPayload)
                  .then()
                  .catch(console.error);
              }),
            )
              .then(console.info)
              .catch(console.error);
          }
        }

        if (userData.webSocketStatus === WebSocketStatus.BATTLE) {
          const userDataJsonString = JSON.stringify(userData);
          wss.clients.forEach(client => {
            client.send(userDataJsonString);
          });
        }

        if (userData.webSocketStatus === WebSocketStatus.DIE) {
          const userDataJsonString = JSON.stringify(userData);
          wss.clients.forEach(client => {
            client.send(userDataJsonString);
          });

          if (userData.playerType == PlayerType.MAN) {
            const content = `${userData.name} dead`;
            const url: string = process.env.DISCORD_WEBHOCK ? process.env.DISCORD_WEBHOCK : "";
            const result = await fetch(url, {
              body: `{"username":"syonet.work - ssb","content":"${content}"}`,
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "POST",
            });
            console.info(result);

            const title = "ssb";
            const body = content;
            const payload = {
              title,
              body,
              icon: "https://avatars3.githubusercontent.com/u/7006562?s=460&v=4",
              url: `https://${process.env.WWW_DOMAIN}/games/ssb`,
            };
            const sendPayload = JSON.stringify(payload);
            const webPushMessage = WebPushMessage.create({
              title,
              body,
              icon: payload.icon,
              url: payload.url,
            });
            await webPushMessage.save();
            const webPushUsers = await WebPushUser.find();

            await Promise.all(
              webPushUsers.map(webPushUser => {
                const subscription = {
                  endpoint: webPushUser.endpoint,
                  keys: {
                    auth: webPushUser.auth,
                    p256dh: webPushUser.p256dh,
                  },
                };

                // 購読時に, クライアントサイドから取得したエンドポイント URI に対して POST リクエストを送信
                webpush
                  .sendNotification(subscription, sendPayload)
                  .then()
                  .catch(console.error);
              }),
            )
              .then(console.info)
              .catch(console.error);
          }
        }

        if (userData.webSocketStatus === WebSocketStatus.DEAD) {
          const userDataJsonString = JSON.stringify(userData);
          wss.clients.forEach(client => {
            client.send(userDataJsonString);
          });
        }

        if (userData.webSocketStatus === WebSocketStatus.CLOSE) {
          const userDataJsonString = JSON.stringify(userData);
          wss.clients.forEach(client => {
            client.send(userDataJsonString);
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

    ws.on("close", () => {});
  });
};
