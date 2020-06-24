import * as crypto from "@www/libs/crypto";

describe("crypto encrypt & decrypt", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("TOKEN_SECRET 'abcdefgefgh' password 'password", () => {
    process.env.TOKEN_SECRET = "abcdefgefgh";
    const password = "password";

    const encrypted = crypto.encrypt(password);
    expect(encrypted).not.toBe(password);

    const decrypted = crypto.decrypt(encrypted);
    expect(decrypted).toBe(password);
  });

  test("TOKEN_SECRET 'hoge' password 'fuga'", () => {
    process.env.TOKEN_SECRET = "hoge";
    const password = "fuga";

    const encrypted = crypto.encrypt(password);
    expect(encrypted).not.toBe(password);

    const decrypted = crypto.decrypt(encrypted);
    expect(decrypted).toBe(password);
  });
});
