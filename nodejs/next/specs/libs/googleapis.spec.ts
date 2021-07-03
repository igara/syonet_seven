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
      jest.fn().mockImplementationOnce(() => ({
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
      jest.fn().mockImplementationOnce(() => ({
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

describe("googleapis: getFolderIDByFolderName", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("create", async () => {
    const token = "token";
    const folderName = "folderName";
    const id = "abcdefg";

    jest.doMock(
      "googleapis",
      jest.fn().mockImplementationOnce(() => ({
        google: {
          auth: {
            OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
          },
          drive: jest.fn().mockImplementation(() => ({
            files: {
              list: jest.fn().mockImplementation(() => ({
                data: {
                  files: [],
                },
              })),
              create: jest.fn().mockImplementation(() => ({
                data: {
                  id,
                },
              })),
            },
          })),
        },
      })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const drive = googleapis.drive(client);
    const getFolderIDByFolderName = await googleapis.getFolderIDByFolderName(drive, folderName);
    expect(getFolderIDByFolderName).toBe(id);
  });

  test("find folder", async () => {
    const token = "token";
    const folderName = "folderName";
    const id = "abcdefg";
    jest.doMock(
      "googleapis",
      jest.fn().mockImplementationOnce(() => ({
        google: {
          auth: {
            OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
          },
          drive: jest.fn().mockImplementation(() => ({
            files: {
              list: jest.fn().mockImplementation(() => ({
                data: {
                  files: [
                    {
                      id,
                    },
                  ],
                },
              })),
            },
          })),
        },
      })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const drive = googleapis.drive(client);
    const getFolderIDByFolderName = await googleapis.getFolderIDByFolderName(drive, folderName);
    expect(getFolderIDByFolderName).toBe(id);
  });
});

describe("googleapis: createChildFolder", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("return", async () => {
    const token = "token";
    const folderName = "folderName";
    const folderID = "folderID";
    jest.doMock(
      "googleapis",
      jest.fn().mockImplementationOnce(() => ({
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
    const createChildFolder = googleapis.createChildFolder(drive, folderName, folderID);
    expect(createChildFolder).not.toBeUndefined();
  });
});

describe("googleapis: createChildFolderByFolderNameAndFolderID", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("create: not list", async () => {
    const token = "token";
    const folderName = "folderName";
    const id = "abcdefg";

    jest.doMock(
      "googleapis",
      jest.fn().mockImplementationOnce(() => ({
        google: {
          auth: {
            OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
          },
          drive: jest.fn().mockImplementation(() => ({
            files: {
              list: jest.fn().mockImplementation(() => ({
                data: {
                  files: [],
                },
              })),
              create: jest.fn().mockImplementation(() => ({
                data: {
                  id,
                },
              })),
            },
          })),
        },
      })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const drive = googleapis.drive(client);
    const createChildFolderByFolderNameAndFolderID = await googleapis.createChildFolderByFolderNameAndFolderID(
      drive,
      folderName,
      id,
    );
    expect(createChildFolderByFolderNameAndFolderID).toBe(id);
  });

  test("create: not same folder", async () => {
    const token = "token";
    const folderName = "folderName";
    const id = "abcdefg";

    jest.doMock(
      "googleapis",
      jest.fn().mockImplementationOnce(() => ({
        google: {
          auth: {
            OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
          },
          drive: jest.fn().mockImplementation(() => ({
            files: {
              list: jest.fn().mockImplementation(() => ({
                data: {
                  files: [
                    {
                      name: "hijklmn",
                    },
                  ],
                },
              })),
              create: jest.fn().mockImplementation(() => ({
                data: {
                  id,
                },
              })),
            },
          })),
        },
      })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const drive = googleapis.drive(client);
    const createChildFolderByFolderNameAndFolderID = await googleapis.createChildFolderByFolderNameAndFolderID(
      drive,
      folderName,
      id,
    );
    expect(createChildFolderByFolderNameAndFolderID).toBe(id);
  });

  test("same folder", async () => {
    const token = "token";
    const folderName = "folderName";
    const id = "abcdefg";

    jest.doMock(
      "googleapis",
      jest.fn().mockImplementationOnce(() => ({
        google: {
          auth: {
            OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
          },
          drive: jest.fn().mockImplementation(() => ({
            files: {
              list: jest.fn().mockImplementation(() => ({
                data: {
                  files: [
                    {
                      id,
                      name: folderName,
                    },
                  ],
                },
              })),
            },
          })),
        },
      })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const drive = googleapis.drive(client);
    const createChildFolderByFolderNameAndFolderID = await googleapis.createChildFolderByFolderNameAndFolderID(
      drive,
      folderName,
      id,
    );
    expect(createChildFolderByFolderNameAndFolderID).toBe(id);
  });
});

describe("googleapis: createHTMLFileByHTMLFileNameAndFolderID", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("create", async () => {
    const token = "token";
    const htmlFileName = "htmlFileName";
    const id = "abcdefg";
    const html = "html";

    jest.doMock(
      "googleapis",
      jest.fn().mockImplementationOnce(() => ({
        google: {
          auth: {
            OAuth2: jest.fn().mockImplementation(() => ({ setCredentials: jest.fn() })),
          },
          drive: jest.fn().mockImplementation(() => ({
            files: {
              create: jest.fn().mockImplementation(() => ({
                data: {
                  id,
                },
              })),
            },
          })),
        },
      })),
    );

    const googleapis = await import("@www/libs/googleapis");
    const client = googleapis.client(token);
    const drive = googleapis.drive(client);
    const createHTMLFileByHTMLFileNameAndFolderID = await googleapis.createHTMLFileByHTMLFileNameAndFolderID(
      drive,
      htmlFileName,
      id,
      html,
    );
    expect(createHTMLFileByHTMLFileNameAndFolderID).toBe(id);
  });
});
