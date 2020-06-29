describe("WebPushResolver: getWebPushKey", () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-ignore
    process.env.NODE_ENV = "test";
  });

  test("getWebPushKey", async () => {
    const publicKey = "publicKey";
    process.env.WEBPUSH_VAPIDKEYS_PUBLIC = publicKey;
    const privateKey = "privateKey";
    process.env.WEBPUSH_VAPIDKEYS_PRIVATE = privateKey;
    const contact = "contact";
    process.env.WEBPUSH_CONTACT = contact;

    jest.doMock("web-push", () => ({
      setVapidDetails: jest.fn(),
    }));

    const { WebPushResolver } = await import("@www/resolvers/webpush");
    const webPushResolver = new WebPushResolver();

    const webPushKey = await webPushResolver.getWebPushKey();

    expect(webPushKey.publicKey).toBe(publicKey);
  });
});

describe("WebPushResolver: createWebPushUser", () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-ignore
    process.env.NODE_ENV = "test";
  });

  test("createWebPushUser: set findWebPushUser", async () => {
    const publicKey = "publicKey";
    process.env.WEBPUSH_VAPIDKEYS_PUBLIC = publicKey;
    const privateKey = "privateKey";
    process.env.WEBPUSH_VAPIDKEYS_PRIVATE = privateKey;
    const contact = "contact";
    process.env.WEBPUSH_CONTACT = contact;

    jest.doMock("web-push", () => ({
      setVapidDetails: jest.fn(),
      sendNotification: jest.fn(),
    }));

    const { connect } = await import("@www/models/typeorm/connection");
    const { WebPushUser } = await import("@www/models/typeorm/entities/webpush_user");
    const connection = await connect();
    WebPushUser.useConnection(connection);

    const endpoint = "endpoint";
    const auth = "auth";
    const p256dh = "p256dh";
    const saveWebPushUser = WebPushUser.create({
      endpoint,
      auth,
      p256dh,
    });
    await saveWebPushUser.save();

    const { WebPushResolver } = await import("@www/resolvers/webpush");
    const webPushResolver = new WebPushResolver();

    const createWebPushUser = await webPushResolver.createWebPushUser(endpoint, auth, p256dh);

    expect(createWebPushUser.message).toBe("Registed");
  });

  test("createWebPushUser: don't set findWebPushUser", async () => {
    const publicKey = "publicKey";
    process.env.WEBPUSH_VAPIDKEYS_PUBLIC = publicKey;
    const privateKey = "privateKey";
    process.env.WEBPUSH_VAPIDKEYS_PRIVATE = privateKey;
    const contact = "contact";
    process.env.WEBPUSH_CONTACT = contact;

    jest.doMock("web-push", () => ({
      setVapidDetails: jest.fn(),
      sendNotification: jest.fn().mockImplementation(
        () =>
          new Promise(resolve => {
            resolve();
          }),
      ),
    }));

    const endpoint = "endpoint1";
    const auth = "auth1";
    const p256dh = "p256dh1";

    const { WebPushResolver } = await import("@www/resolvers/webpush");
    const webPushResolver = new WebPushResolver();

    const createWebPushUser = await webPushResolver.createWebPushUser(endpoint, auth, p256dh);

    expect(createWebPushUser.message).toBe("OK");
  });
});
