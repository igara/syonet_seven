import { v4 as uuidv4 } from "uuid";
import WS from "ws";
import { IncomingMessage } from "http";

type ChatWS = {
  chatID: string;
  type: string;
  userAgent: string;
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
        const json = JSON.parse(message.toString());
        if (ws === client) {
          if (json.type === "create") {
            ws.userAgent = json.userAgent;
            client.send(
              JSON.stringify({
                ...json,
                uuid: uuidv4(),
              }),
            );
            return;
          }
          if (json.type === "client_offer" || json.type === "mtf_offer") return;
        } else {
          if (client.chatID !== json.chatID || json.type === "create") return;
          console.log(ws.userAgent);
          if (json.userAgent === "WebRTC MCU Chat" && json.type === "connect_mcu") {
          }
          if (json.userAgent !== "WebRTC MCU Chat" && json.type === "connect_client") {
          }
          delete json.chatID;
          client.send(JSON.stringify(json));
        }
      });
    });

    ws.on("close", () => {});
  });
};
