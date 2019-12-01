import User from "@www/models/mongoose/user";

describe("getUserInfo", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.DB_HOST = "mongodb://localhost:27017";
  });
  test("User.authのid・providerの指定がない時", async () => {
    const { dbConnect, dbClose } = require("@www/models/mongoose");
    const { getUserInfo } = require("@www/models/mongoose/user");
    await dbConnect();
    const result = await getUserInfo();
    expect(result).toBe(null);
    await dbClose();
  });
  test("User.authのid・providerの指定があり、DBにも存在する時", async () => {
    const { dbConnect, dbClose } = require("@www/models/mongoose");
    const { getUserInfo } = require("@www/models/mongoose/user");
    await dbConnect();
    const result = await getUserInfo("1111111111111", "google");
    expect(result).toEqual({
      displayName: "google user",
      image: "https://lh4.googleusercontent.com/photo.jpg?sz=50",
    });
    await dbClose();
  });
  test("User.authのid・providerの指定があり、DBには存在しない時", async () => {
    const { dbConnect, dbClose } = require("@www/models/mongoose");
    const { getUserInfo } = require("@www/models/mongoose/user");
    await dbConnect();
    const result = await getUserInfo("1111111111112", "google");
    expect(result).toBe(null);
    await dbClose();
  });
});
