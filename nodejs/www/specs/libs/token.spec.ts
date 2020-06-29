import * as token from "@www/libs/token";

describe("token lib", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("generateAccessToken", () => {
    process.env.TOKEN_SECRET = "token_secret";
    process.env.TOKEN_AUDIENCE = "token_audience";
    process.env.TOKEN_ISSUER = "token_issuer";

    const userId = "1111";
    const generateAccessToken = token.generateAccessToken(userId);
    expect(generateAccessToken).not.toBe(userId);
  });
});
