import { call } from "@www/libs/api";

/**
 * WebPushに使用する鍵を取得
 */
export const callWebpushKey = async () => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/webpush/get`,
    method: "GET",
    body: null,
  });
  const json = await result.json();
  return json;
};

/**
 * WebPushの登録を行う
 */
export const callRegistWebpush = async (notification: { endpoint: string; auth: string; p256dh: string }) => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/webpush/post`,
    method: "POST",
    body: notification,
  });
  const json = await result.json();
  return json;
};
