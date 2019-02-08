export default null;
declare var self: ServiceWorkerGlobalScope;

self.addEventListener("install", event => {}, false);

self.addEventListener(
	"activate",
	event => {
		event.waitUntil(self.clients.claim());
	},
	false
);

self.addEventListener(
	"push",
	event => {
		// デスクトップ通知の表示処理
		if (!event.data) {
			return;
		}

		const data = event.data.json(); // ペイロードを JSON 形式でパース
		const title = data.title;
		const body = data.body;
		const icon = data.icon;
		const url = data.url;

		event.waitUntil(
			self.registration.showNotification(title, { body, icon, data: { url } })
		);
	},
	false
);

self.addEventListener(
	"notificationclick",
	event => {
		const notification = event.notification; // Notification インスタンスを取得
		const url = notification.data.url;

		// 通知をクリックしたら, URL で指定されたページを新しいタブで開く
		event.waitUntil(self.clients.openWindow(url));
	},
	false
);
