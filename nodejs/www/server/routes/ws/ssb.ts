import * as WS from "ws";

enum Status {
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
	status: number;
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

			if (userData.status === Status.OPEN) {
				userData.id = userId;
				userId += 1;
				const userDataJsonString = JSON.stringify(userData);
				wss.clients.forEach(client => {
					client.send(userDataJsonString);
				});
			}

			if (userData.status === Status.BATTLE) {
				const userDataJsonString = JSON.stringify(userData);
				wss.clients.forEach(client => {
					client.send(userDataJsonString);
				});
			}

			if (userData.status === Status.DEAD) {
				const userDataJsonString = JSON.stringify(userData);
				wss.clients.forEach(client => {
					client.send(userDataJsonString);
				});
			}

			if (userData.status === Status.CLOSE) {
				const userDataJsonString = JSON.stringify(userData);
				wss.clients.forEach(client => {
					client.send(userDataJsonString);
				});
			}
		});

		ws.on("close", () => {});
	});
};
