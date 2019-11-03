describe("callLoginCheck", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("login", async () => {
    jest.doMock("@www/libs/api", () => ({
      call: jest.fn(() => ({
        json: jest.fn(() => ({
          status: 200,
          user: { id: 1 },
        })),
      })),
    }));

    const callLoginCheck = require("@www/libs/fetchs/auth").callLoginCheck;
    const json = await callLoginCheck();
    expect(json).toEqual({
      status: 200,
      user: { id: 1 },
    });
  });
});

describe("callLogout", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("logout", async () => {
    jest.doMock("@www/libs/api", () => ({
      call: jest.fn(() => ({
        json: jest.fn(() => ({
          status: 200,
          message: "OK",
        })),
      })),
    }));

    const callLogout = require("@www/libs/fetchs/auth").callLogout;
    const json = await callLogout();
    expect(json).toEqual({
      status: 200,
      message: "OK",
    });
  });
});

describe("callAuthAdminCheck", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("adminCheck", async () => {
    jest.doMock("@www/libs/api", () => ({
      call: jest.fn(() => ({
        json: jest.fn(() => ({
          status: 200,
          message: "OK",
        })),
      })),
    }));

    const callAuthAdminCheck = require("@www/libs/fetchs/auth").callAuthAdminCheck;
    const json = await callAuthAdminCheck();
    expect(json).toEqual({
      status: 200,
      message: "OK",
    });
  });
});
