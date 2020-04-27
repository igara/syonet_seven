import WS from "ws";

export const chatSocketRoute = (wss: WS.Server) => {
  wss.on("connection", (ws: WS) => {
    ws.on("message", async (message: Buffer | string) => {
      wss.clients.forEach(client => {
        if (ws === client) {
          console.log("- skip sender -");
        } else {
          client.send(message);
        }
      });
    });

    ws.on("close", () => {});
  });
};
