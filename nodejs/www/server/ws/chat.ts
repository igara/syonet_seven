import { v4 as uuidv4 } from "uuid";
import WS from "ws";
import { IncomingMessage } from "http";

type ChatWS = {
  chatID: string;
  type: string;
  userAgent: string;
  clientUUID: string;
  mcuUUID: string;
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
        console.log("json");
        console.log(json);

        if (client.chatID !== json.chatID) return;
        if (json.type === "delete") {
          client.send(JSON.stringify(json));
          return;
        }
        if (ws === client) {
          if (json.type === "ping") {
            client.send(
              JSON.stringify({
                echo: "OK",
              }),
            );
          }
          if (json.type === "create") {
            ws.userAgent = json.userAgent;
            const uuid = uuidv4();

            if (ws.userAgent !== "WebRTC MCU Chat") {
              ws.clientUUID = uuid;
              client.send(
                JSON.stringify({
                  ...json,
                  clientUUID: uuid,
                }),
              );
            } else {
              ws.mcuUUID = uuid;
              client.send(
                JSON.stringify({
                  ...json,
                  mcuUUID: uuid,
                }),
              );
            }

            return;
          }

          if (json.type === "mcu_local_answer" || json.type === "client_local_answer") {
            ws.clientUUID = json.clientUUID;
            ws.mcuUUID = json.mcuUUID;
            client.send(JSON.stringify(json));
            return;
          }
        } else {
          if (json.type === "create") return;

          if (json.userAgent === "WebRTC MCU Chat") {
            if (
              (json.type === "create_client_peer_connection" ||
                json.type === "mcu_remote_offer" ||
                json.type === "client_local_offer" ||
                json.type === "client_remote_answer" ||
                json.type === "candidate") &&
              client.userAgent !== "WebRTC MCU Chat" &&
              client.clientUUID === json.clientUUID
            ) {
              client.send(JSON.stringify(json));
              return;
            }
          }

          if (json.userAgent !== "WebRTC MCU Chat") {
            if (json.type === "create_mcu_peer_connection" && client.userAgent === "WebRTC MCU Chat") {
              client.send(
                JSON.stringify({
                  ...json,
                  mcuUUID: client.mcuUUID,
                }),
              );
              return;
            }

            if (
              (json.type === "mcu_local_offer" ||
                json.type === "mcu_remote_answer" ||
                json.type === "client_remote_offer" ||
                json.type === "candidate") &&
              client.userAgent === "WebRTC MCU Chat" &&
              client.mcuUUID === json.mcuUUID
            ) {
              client.send(
                JSON.stringify({
                  ...json,
                  mcuUUID: client.mcuUUID,
                }),
              );
              return;
            }
          }
        }
      });
    });

    ws.on("close", () => {});
  });
};
