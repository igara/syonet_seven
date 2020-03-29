describe("callWebpushKey", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("key", async () => {
    jest.doMock("@www/libs/api", () => ({
      call: jest.fn(() => ({
        json: jest.fn(() => ({
          publicKey: "11111111111111111",
        })),
      })),
    }));

    const callWebpushKey = require("@www/libs/fetchs/webpush").callWebpushKey;
    const json = await callWebpushKey();
    expect(json).toEqual({
      publicKey: "11111111111111111",
    });
  });
});

describe("callRegistWebpush", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("regist", async () => {
    jest.doMock("@www/libs/api", () => ({
      call: jest.fn(() => ({
        json: jest.fn(() => ({
          status: 200,
          message: "OK",
        })),
      })),
    }));

    const callRegistWebpush = require("@www/libs/fetchs/webpush").callRegistWebpush;
    const json = await callRegistWebpush({ endpoint: "111", auth: "222", p256dh: "333" });
    expect(json).toEqual({
      status: 200,
      message: "OK",
    });
  });
});
