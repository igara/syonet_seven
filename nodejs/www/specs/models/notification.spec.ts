import { NotificationDocument } from "@www/models/notification";

describe("getNotificationList", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.DB_HOST = "mongodb://localhost:27017";
  });
  test("通知する対象一覧を取得", async () => {
    const { dbConnect, dbClose } = require("@www/models");
    const { getNotificationList } = require("@www/models/notification");
    await dbConnect();
    const result = await getNotificationList();

    expect(
      result.map((r: NotificationDocument) => ({
        endpoint: r.endpoint,
        auth: r.auth,
        p256dh: r.p256dh,
      })),
    ).toEqual([
      {
        endpoint: "https://example1.com",
        auth: "1111111111111",
        p256dh: "1111111111111",
      },
      {
        endpoint: "https://example2.com",
        auth: "2222222222222",
        p256dh: "2222222222222",
      },
    ]);
    await dbClose();
  });
});

describe("insertNotification", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("通知対象の情報を追加", async () => {
    const { dbConnect, dbClose } = require("@www/models");
    await dbConnect();
    const notification = {
      endpoint: "https://example3.com",
      auth: "33333333333333",
      p256dh: "33333333333333",
    };

    const { insertNotification } = require("@www/models/notification");
    const N = require("@www/models/notification").default;
    await insertNotification(notification);
    await N.deleteOne(notification);
    await dbClose();
  });
});
