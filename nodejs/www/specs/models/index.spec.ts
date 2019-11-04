describe("index", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    global.TEST = "test";
    process.env.DB_HOST = "mongodb://localhost:27017";
  });

  test("test", async () => {
    jest.doMock("mongoose", () => ({
      connect: jest.fn(),
      connection: {
        close: jest.fn(),
      },
    }));
    const model = require("@www/models");
    await model.dbConnect();
    await model.dbClose();
  });

  test("localhost", async () => {
    global.TEST = "";
    jest.doMock("mongoose", () => ({
      connect: jest.fn(),
      connection: {
        close: jest.fn(),
      },
    }));
    const model = require("@www/models");
    await model.dbConnect();
    await model.dbClose();
  });
});
