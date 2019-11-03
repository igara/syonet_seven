describe("getUserInfo", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("User.authのid・providerの指定がない時", async () => {
    const { dbConnect, dbClose } = require("@www/models");
    const { getUserInfo } = require("@www/models/user");
    await dbConnect();
    const result = await getUserInfo();
    expect(result).toBe(null);
    await dbClose();
  });
  test("User.authのid・providerの指定があり、DBにも存在する時", async () => {
    const { dbConnect, dbClose } = require("@www/models");
    const { getUserInfo } = require("@www/models/user");
    await dbConnect();
    const result = await getUserInfo("1111111111111", "google");
    expect(result).toEqual({
      displayName: "google user",
      image: "https://lh4.googleusercontent.com/photo.jpg?sz=50",
    });
    await dbClose();
  });
  test("User.authのid・providerの指定があり、DBには存在しない時", async () => {
    const { dbConnect, dbClose } = require("@www/models");
    const { getUserInfo } = require("@www/models/user");
    await dbConnect();
    const result = await getUserInfo("1111111111112", "google");
    expect(result).toBe(null);
    await dbClose();
  });
});

describe("upsertByAuthUser", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("Userの指定がある時", async () => {
    const { dbConnect, dbClose } = require("@www/models");
    const { upsertByAuthUser } = require("@www/models/user");
    await dbConnect();
    const user = {
      id: 33333,
      provider: "twitter",
    };
    const result = await upsertByAuthUser(user);
    expect(result.auth.id).toBe(user.id);
    expect(result.auth.provider).toBe(user.provider);
    expect(result.type).toBe("general");
    await dbClose();
  });
});
