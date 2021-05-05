import gql from "graphql-tag";
import { client as apolloClient } from "@www/libs/apollo/client";

export type GetWebPushKey = {
  getWebPushKey: {
    publicKey: string;
  };
};

export const GET_WEBPUSH_KEY = gql`
  query {
    getWebPushKey {
      publicKey
    }
  }
`;

export type CreateWebPushUser = {
  createWebPushUser: {
    message: "Registed" | "OK";
  };
};

export const CREATE_WEBPUSH_USER = gql`
  mutation CreateWebPushUser($endpoint: String!, $auth: String!, $p256dh: String!) {
    createWebPushUser(endpoint: $endpoint, auth: $auth, p256dh: $p256dh) {
      message
    }
  }
`;

/**
 * Base64 エンコードからバイナリ形式に変換する
 */
export const urlsafeBase64ToBinary = (urlsafeBase64: string) => {
  const base64 = urlsafeBase64.replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const binary = new Uint8Array(raw.length);

  for (let i = 0, len = binary.length; i < len; i++) {
    binary[i] = raw.charCodeAt(i);
  }

  return binary;
};

/**
 * ArrayBuffer から Base64 エンコードに変換する
 */
export const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
  return (
    window
      // @ts-ignore
      .btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
  );
};

export const requestWebpush = async () => {
  if (typeof window === "undefined") return;
  if (typeof navigator === "undefined" || typeof navigator.serviceWorker === "undefined") return;
  if (typeof Notification === "undefined" || typeof Notification.requestPermission === "undefined") return;

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // 許可された場合
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      if (typeof navigator.serviceWorker === "undefined") {
        throw new Error("sw registration");
      }
      const res = await apolloClient.query<GetWebPushKey>({
        query: GET_WEBPUSH_KEY,
      });

      const applicationServerKey = urlsafeBase64ToBinary(res.data.getWebPushKey.publicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const auth = subscription.getKey("auth");
      const p256dh = subscription.getKey("p256dh");
      if (auth && p256dh) {
        const notification = {
          endpoint: subscription.endpoint,
          auth: arrayBufferToBase64(auth),
          p256dh: arrayBufferToBase64(p256dh),
        };
        if (notification.endpoint && notification.auth && notification.p256dh) {
          await apolloClient.mutate<CreateWebPushUser>({
            mutation: CREATE_WEBPUSH_USER,
            variables: {
              endpoint: notification.endpoint,
              auth: notification.auth,
              p256dh: notification.p256dh,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
