import { v4 as uuidv4 } from "uuid";
import WS from "ws";
import { IncomingMessage } from "http";

type P2PChatWS = {
  chatID: string;
  type: string;
  clientUUID: string;
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
            const uuid = uuidv4();
            ws.clientUUID = uuid;
            client.send(
              JSON.stringify({
                ...json,
                clientUUID: uuid,
              }),
            );

            return;
          }

          if (json.type === "another_local_answer" || json.type === "self_local_answer") {
            client.send(JSON.stringify(json));
            return;
          }
        } else {
          if (json.type === "create") return;

          if (
            (json.type === "another_peer_connection" ||
              json.type === "another_local_offer" ||
              json.type === "another_remote_answer" ||
              json.type === "self_remote_offer") &&
            client.clientUUID !== json.selfClientUUID
          ) {
            client.send(JSON.stringify(json));
            return;
          }

          if (
            (json.type === "self_peer_connection" ||
              json.type === "another_remote_offer" ||
              json.type === "self_local_offer" ||
              json.type === "self_remote_answer") &&
            client.clientUUID === json.selfClientUUID
          ) {
            client.send(JSON.stringify(json));
            return;
          }

          if (json.type === "candidate" && client.clientUUID !== json.clientUUID) {
            client.send(JSON.stringify(json));
            return;
          }
        }
      });
    });

    ws.on("close", () => {});
  });
};
