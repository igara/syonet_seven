import * as WS from "ws";

enum WebSocketStatus {
	OPEN = 0,
	BATTLE,
	DEAD,
	CLOSE
}

enum PlayerType {
	MAN = 0,
	CPU
}

type UserData = {
	id: number;
	name: string;
	webSocketStatus: number;
	playerType: number;
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
		ws.on("message", (message: Buffer | string) => {
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
			}

			if (userData.webSocketStatus === WebSocketStatus.BATTLE) {
				const userDataJsonString = JSON.stringify(userData);
				wss.clients.forEach(client => {
					client.send(userDataJsonString);
				});
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
		});

		ws.on("close", () => {});
	});
};
