describe("AuthResolver", () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-ignore
    process.env.NODE_ENV = "test";
  });

  test("checkAuth: don't set user data", async () => {
    const { AuthResolver } = await import("@www/resolvers/auth");
    const authResolver = new AuthResolver();

    const ctx = {};
    const checkAuth = await authResolver.checkAuth(ctx);

    expect(checkAuth).toBeUndefined();
  });

  test("checkAuth: don't set auth data", async () => {
    const { AuthResolver } = await import("@www/resolvers/auth");
    const authResolver = new AuthResolver();

    const ctx = {
      user: 9876,
    };
    const checkAuth = await authResolver.checkAuth(ctx);

    expect(checkAuth).toBeUndefined();
  });

  test("checkAuth: get auth data", async () => {
    const { connect } = await import("@www/models/typeorm/connection");
    const { AuthFacebook } = await import("@www/models/typeorm/entities/auth_facebook");
    const connection = await connect();
    AuthFacebook.useConnection(connection);

    const user = {
      snsID: "1111",
      username: "username",
      imageURL: "https://example.com",
      accessToken: "accessToken",
    };
    const authFacebook = AuthFacebook.create({
      snsID: user.snsID,
      username: user.username,
      imageURL: user.imageURL,
      accessToken: user.accessToken,
    });
    const saveAuthData = await authFacebook.save();

    const { AuthResolver } = await import("@www/resolvers/auth");
    const authResolver = new AuthResolver();

    const ctx = {
      user: saveAuthData.id,
    };
    const checkAuth = await authResolver.checkAuth(ctx);

    if (!checkAuth) return;
    expect(checkAuth.id).toBe(saveAuthData.id);
    expect(checkAuth.snsID).toBe(saveAuthData.snsID);
    expect(checkAuth.username).toBe(saveAuthData.username);
    expect(checkAuth.imageURL).toBe(saveAuthData.imageURL);
  });
});
