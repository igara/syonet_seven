import { callWebpushKey, callRegistWebpush } from "@www/libs/fetchs/webpush";

/**
 * Base64 エンコードからバイナリ形式に変換する
 */
const urlsafeBase64ToBinary = (urlsafeBase64: string) => {
  const base64 = urlsafeBase64.replace(/-/g, "+").replace(/_/g, "/");
  // eslint-disable-next-line no-undef
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
const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
  return (
    // eslint-disable-next-line no-undef
    window
      // @ts-ignore
      .btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
  );
};

(async () => {
  // eslint-disable-next-line no-undef
  if (navigator.serviceWorker) {
    // eslint-disable-next-line no-undef
    if (location.href) {
      const swFile = "/sw.js";
      const scope = "/";
      try {
        // eslint-disable-next-line no-undef
        await navigator.serviceWorker.register(swFile, { scope });
        // eslint-disable-next-line no-undef
        const cache = await caches.open("js");
        const requests = await cache.keys();
        requests.forEach(async request => {
          if (request.url.match(/notification.js/)) {
            // eslint-disable-next-line no-undef
            if (typeof Notification !== "undefined" && typeof Notification.requestPermission !== "undefined") {
              // eslint-disable-next-line no-undef
              const permission = await Notification.requestPermission();
              switch (permission) {
                case "granted": {
                  // 許可された場合
                  // eslint-disable-next-line no-undef
                  const registration = await navigator.serviceWorker.register(request.url, {
                    scope: "/",
                  });

                  // eslint-disable-next-line no-undef
                  if (typeof navigator.serviceWorker === "undefined") {
                    throw new Error("sw registration");
                  }
                  const res = await callWebpushKey();
                  const applicationServerKey = urlsafeBase64ToBinary(res.publicKey);
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
                    await callRegistWebpush(notification);
                  }

                  break;
                }
                case "denied": {
                  // ブロックされた場合
                  break;
                }
                case "default": {
                  // 無視された場合
                  break;
                }
                default: {
                  break;
                }
              }
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
})();