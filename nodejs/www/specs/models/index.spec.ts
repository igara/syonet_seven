const env = JSON.parse(JSON.stringify(process.env)).WWW_ENV;

describe("index", () => {
	beforeEach(() => {
		jest.resetModules();
	});
	afterEach(() => {
		global.TEST = "test";
		process.env.WWW_ENV = env;
	});
	test("test実行時 docker上じゃない想定", async () => {
		global.TEST = "test";
		process.env.WWW_ENV = "";
		jest.doMock("mongoose", () => ({
			connect: jest.fn(),
			connection: {
				close: jest.fn()
			}
		}));
		const mongo = require("@www/models");
		await mongo.dbConnect();
		await mongo.dbClose();
	});
	test("test実行時 docker上想定", async () => {
		global.TEST = "test";
		process.env.WWW_ENV = "local";
		jest.doMock("mongoose", () => ({
			connect: jest.fn(),
			connection: {
				close: jest.fn()
			}
		}));
		const mongo = require("@www/models");
		await mongo.dbConnect();
		await mongo.dbClose();
	});
	test("test環境以外", async () => {
		global.TEST = "";
		jest.doMock("mongoose", () => ({
			connect: jest.fn(),
			connection: {
				close: jest.fn()
			}
		}));
		const mongo = require("@www/models");
		await mongo.dbConnect();
		await mongo.dbClose();
	});
});
