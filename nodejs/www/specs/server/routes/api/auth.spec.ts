describe("/auth/check", () => {
	beforeEach(() => {
		jest.resetModules();
	});
	test("tokenがない時", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			getSessionBySessionId: jest.fn().mockImplementation(sessionId => {
				return {
					session: null
				};
			})
		}));
		jest.doMock("@www/server/models/user", () => ({
			getUserInfo: jest.fn().mockImplementation((id, provider) => {
				return null;
			})
		}));

		const request = {
			headers: {}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authCheck } = require("@www/server/routes/api/auth");
		await authCheck(request, response);
		expect(response.status.mock.calls[0][0]).toBe(401);
		expect(response.send.mock.calls[0][0].status).toBe(401);
		expect(response.send.mock.calls[0][0].message).toBe("NG");
	});
	test("空のtokenの時", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			getSessionBySessionId: jest.fn().mockImplementation(sessionId => {
				return {
					session: null
				};
			})
		}));
		jest.doMock("@www/server/models/user", () => ({
			getUserInfo: jest.fn().mockImplementation((id, provider) => {
				return null;
			})
		}));

		const request = {
			headers: {
				token: ""
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authCheck } = require("@www/server/routes/api/auth");
		await authCheck(request, response);
		expect(response.status.mock.calls[0][0]).toBe(401);
		expect(response.send.mock.calls[0][0].status).toBe(401);
		expect(response.send.mock.calls[0][0].message).toBe("NG");
	});

	test("ログイン中のCookieではない場合", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			getSessionBySessionId: jest.fn().mockImplementation(sessionId => {
				return {
					session: {}
				};
			})
		}));
		jest.doMock("@www/server/models/user", () => ({
			getUserInfo: jest.fn().mockImplementation((id, provider) => {
				return null;
			})
		}));

		const request = {
			headers: {
				token: "connect.sid=s:2222222222222.abcdf"
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authCheck } = require("@www/server/routes/api/auth");
		await authCheck(request, response);
		expect(response.status.mock.calls[0][0]).toBe(401);
		expect(response.send.mock.calls[0][0].status).toBe(401);
		expect(response.send.mock.calls[0][0].message).toBe("NG");
	});

	test("適切なログイン中のCookieである場合", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			getSessionBySessionId: jest.fn().mockImplementation(async sessionId => {
				return {
					session: {
						passport: {
							user: {
								id: 1111111111111,
								provider: "google"
							}
						}
					}
				};
			})
		}));
		jest.doMock("@www/server/models/user", () => ({
			getUserInfo: jest.fn().mockImplementation((id, provider) => {
				return {
					displayName: "google user",
					image: "https://lh4.googleusercontent.com/photo.jpg?sz=50"
				};
			})
		}));

		const request = {
			headers: {
				token: "connect.sid=s:1111111111111.abcdf"
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authCheck } = require("@www/server/routes/api/auth");
		await authCheck(request, response);
		expect(response.status.mock.calls[0][0]).toBe(200);
		expect(response.send.mock.calls[0][0].status).toBe(200);
		expect(response.send.mock.calls[0][0].message).toBe("OK");
		expect(response.send.mock.calls[0][0].user.displayName).toBe("google user");
		expect(response.send.mock.calls[0][0].user.image).toBe(
			"https://lh4.googleusercontent.com/photo.jpg?sz=50"
		);
	});

	test("DB error", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			getSessionBySessionId: jest.fn().mockImplementation(() => {
				throw new Error("db error");
			})
		})),
			jest.doMock("@www/server/models/user", () => ({
				getUserInfo: jest.fn().mockImplementation((id, provider) => {
					return {
						displayName: "google user",
						image: "https://lh4.googleusercontent.com/photo.jpg?sz=50"
					};
				})
			}));

		const request = {
			headers: {
				token: "connect.sid=s:1111111111111.abcdf"
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authCheck } = require("@www/server/routes/api/auth");
		await authCheck(request, response);
		expect(response.status.mock.calls[0][0]).toBe(500);
		expect(response.send.mock.calls[0][0].status).toBe(500);
		expect(response.send.mock.calls[0][0].message).toBe("NG");
	});
});

describe("/auth/delete", () => {
	beforeEach(() => {
		jest.resetModules();
	});
	test("tokenがない時", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			deleteSession: jest.fn()
		}));

		const request = {
			headers: {}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authDelete } = require("@www/server/routes/api/auth");
		await authDelete(request, response);
		expect(response.status.mock.calls[0][0]).toBe(401);
		expect(response.send.mock.calls[0][0].status).toBe(401);
		expect(response.send.mock.calls[0][0].message).toBe("NG");
	});

	test("空のtokenの時", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			deleteSession: jest.fn()
		}));

		const request = {
			headers: {
				token: ""
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authDelete } = require("@www/server/routes/api/auth");
		await authDelete(request, response);
		expect(response.status.mock.calls[0][0]).toBe(401);
		expect(response.send.mock.calls[0][0].status).toBe(401);
		expect(response.send.mock.calls[0][0].message).toBe("NG");
	});

	test("存在しないtokenの時", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			deleteSession: jest.fn().mockImplementation(() => {
				return { ok: 0 };
			})
		}));

		const request = {
			headers: {
				token: "connect.sid=s:999999999.abcdf"
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authDelete } = require("@www/server/routes/api/auth");
		await authDelete(request, response);
		expect(response.status.mock.calls[0][0]).toBe(200);
		expect(response.send.mock.calls[0][0].status).toBe(200);
		expect(response.send.mock.calls[0][0].message).toBe("OK");
	});

	test("ログイン中のtokenではない場合", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			deleteSession: jest.fn().mockImplementation(() => {
				return { ok: 0 };
			})
		}));

		const request = {
			headers: {
				token: "connect.sid=s:2222222222222.abcdf"
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authDelete } = require("@www/server/routes/api/auth");
		await authDelete(request, response);
		expect(response.status.mock.calls[0][0]).toBe(200);
		expect(response.send.mock.calls[0][0].status).toBe(200);
		expect(response.send.mock.calls[0][0].message).toBe("OK");
	});

	test("適切なログイン中のtokenである場合", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			deleteSession: jest.fn().mockImplementation(() => {
				return { ok: 1 };
			})
		}));

		const request = {
			headers: {
				token: "connect.sid=s:1111111111111.abcdf"
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authDelete } = require("@www/server/routes/api/auth");
		await authDelete(request, response);
		expect(response.status.mock.calls[0][0]).toBe(200);
		expect(response.send.mock.calls[0][0].status).toBe(200);
		expect(response.send.mock.calls[0][0].message).toBe("OK");
	});

	test("DB error", async () => {
		jest.doMock("@www/server/models", () => ({
			dbConnect: jest.fn(),
			dbClose: jest.fn()
		}));
		jest.doMock("@www/server/models/session", () => ({
			deleteSession: jest.fn().mockImplementation(() => {
				throw new Error("db error");
			})
		}));
		const request = {
			headers: {
				token: "connect.sid=s:1111111111111.abcdf"
			}
		};
		const response = {
			status: jest.fn(),
			send: jest.fn()
		};
		const { authDelete } = require("@www/server/routes/api/auth");
		await authDelete(request, response);
		expect(response.status.mock.calls[0][0]).toBe(500);
		expect(response.send.mock.calls[0][0].status).toBe(500);
		expect(response.send.mock.calls[0][0].message).toBe("NG");
	});
});
