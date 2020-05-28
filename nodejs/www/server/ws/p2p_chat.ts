import { v4 as uuidv4 } from "uuid";
import WS from "ws";
import { IncomingMessage } from "http";

type P2PChatWS = {
  chatID: string;
  type: string;
} & WS;

export type P2PChatWSS = {
  clients: P2PChatWS[];
} & WS.Server;

export const p2pChatSocketRoute = (wss: P2PChatWSS) => {
  wss.on("connection", (ws: P2PChatWS, req: IncomingMessage) => {
    const chatID = req.url ? req.url.replace("/p2p_chat/", "") : "";
    ws.chatID = chatID;

    ws.on("message", async (message: Buffer | string) => {
      wss.clients.forEach(client => {
        const json = JSON.parse(message.toString());
        if (ws === client) {
          if (json.type === "create") {
            client.send(
              JSON.stringify({
                ...json,
                uuid: uuidv4(),
              }),
            );
          }
        } else {
          if (client.chatID === json.chatID && json.type !== "create") {
            delete json.chatID;
            client.send(JSON.stringify(json));
          }
        }
      });
    });

    ws.on("close", () => {});
  });
};
