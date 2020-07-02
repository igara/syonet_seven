// @ts-ignore
describe("googleapis: client", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("return", async () => {
    const token = "token";
    jest.doMock("googleapis", () => ({
      google: {
        auth: {
          OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
        },
      },
    }));

    const googleapis = await import("@www/libs/googleapis");
    const result = googleapis.client(token);
    expect(result).not.toBeUndefined();
  });
});

describe("googleapis: drive", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("return", async () => {
    const token = "token";
    jest.doMock(
      "googleapis",
      jest
        .fn()
        .mockImplementationOnce(() => ({
          google: {
            auth: {
              OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
            },
            drive: jest.fn().mockImplementation(() => jest.fn()),
          },
        }))
        .mockImplementationOnce(() => ({
          google: {
            auth: {
              OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
            },
            drive: jest.fn().mockImplementation(() => jest.fn()),
          },
        })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const drive = googleapis.drive(client);
    expect(drive).not.toBeUndefined();
  });
});

describe("googleapis: sheets", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("return", async () => {
    const token = "token";
    jest.doMock(
      "googleapis",
      jest
        .fn()
        .mockImplementationOnce(() => ({
          google: {
            auth: {
              OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
            },
            sheets: jest.fn().mockImplementation(() => jest.fn()),
          },
        }))
        .mockImplementationOnce(() => ({
          google: {
            auth: {
              OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
            },
            sheets: jest.fn().mockImplementation(() => jest.fn()),
          },
        })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const sheets = googleapis.sheets(client);
    expect(sheets).not.toBeUndefined();
  });
});
