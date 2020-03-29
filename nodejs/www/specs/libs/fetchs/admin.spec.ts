describe("callUserList", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("userList", async () => {
    jest.doMock("@www/libs/api", () => ({
      call: jest.fn(() => ({
        json: jest.fn(() => ({
          status: 200,
          message: "OK",
          userCount: 1,
          userList: [{ id: 1 }],
        })),
      })),
    }));

    const callUserList = require("@www/libs/fetchs/admin").callUserList;
    const json = await callUserList({ limit: 1, next: 3 });
    expect(json).toEqual({
      status: 200,
      message: "OK",
      userCount: 1,
      userList: [{ id: 1 }],
    });
  });
});
