import { call, getApiHost } from "@www/libs/api";

/**
 * WebPushに使用する鍵を取得
 */
export const callWebpushKey = async () => {
	const result = await call({
		url: `${getApiHost()}/api/webpush`,
		method: "GET",
		body: null
	});
	const json = await result.json();
	return json;
};

/**
 * WebPushの登録を行う
 */
export const callRegistWebpush = async (notification: {
	endpoint: string;
	auth: string;
	p256dh: string;
}) => {
	const result = await call({
		url: `${getApiHost()}/api/webpush`,
		method: "POST",
		body: notification
	});
	const json = await result.json();
	return json;
};
