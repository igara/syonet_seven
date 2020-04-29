import WS from "ws";
import { IncomingMessage } from "http";

type ChatWS = {
  chatID: string;
} & WS;

export type ChatWSS = {
  clients: ChatWS[];
} & WS.Server;

export const chatSocketRoute = (wss: ChatWSS) => {
  wss.on("connection", (ws: ChatWS, req: IncomingMessage) => {
    const chatID = req.url ? req.url.replace("/chat/", "") : "";
    ws.chatID = chatID;

    ws.on("message", async (message: Buffer | string) => {
      wss.clients.forEach(client => {
        if (ws === client) {
          console.info("- skip sender -");
        } else {
          const json = JSON.parse(message.toString());
          if (client.chatID === json.chatID) {
            delete json.chatID;
            client.send(JSON.stringify(json));
          }
        }
      });
    });

    ws.on("close", () => {});
  });
};
