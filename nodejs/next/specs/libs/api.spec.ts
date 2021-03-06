// @ts-ignore
describe("call", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("has not token", async () => {
    const option = {
      body: {},
      method: "",
      url: "",
    };
    jest.doMock("isomorphic-fetch", () =>
      jest.fn().mockImplementation(
        () =>
          new Promise(resolve => {
            resolve({
              ok: true,
              status: 200,
              json: () => {
                return new Promise(resolve => {
                  resolve({ id: 123 });
                });
              },
            });
          }),
      ),
    );

    import("@www/libs/api").then(async api => {
      const result = await api.call(option);
      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      const json = await result.json();
      expect(json.id).toBe(123);
    });
  });
});
