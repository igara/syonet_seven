import * as crypto from "@www/libs/crypto";

describe("ChatResolver", () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-ignore
    process.env.NODE_ENV = "test";
  });

  test("createChat & getChatByIdAndPassword: get chat data", async () => {
    const { ChatResolver } = await import("@www/resolvers/chat");
    const chatResolver = new ChatResolver();

    const name = "name";
    const password = "password";
    const saved = await chatResolver.createChat(name, password);

    expect(saved.name).toBe(name);
    expect(saved.password).not.toBe(password);

    const decrypted = crypto.decrypt(saved.password);
    expect(decrypted).toBe(password);

    const chat = await chatResolver.getChatByIdAndPassword(saved.id, password);
    if (!chat) return;
    expect(chat.id).toBe(saved.id);
    expect(chat.name).toBe(saved.name);
    expect(chat.password).toBe(saved.password);
  });

  test("createChat & getChatByIdAndPassword: password was different", async () => {
    const { ChatResolver } = await import("@www/resolvers/chat");
    const chatResolver = new ChatResolver();

    const name = "name";
    const password = "password";
    const saved = await chatResolver.createChat(name, password);

    expect(saved.name).toBe(name);
    expect(saved.password).not.toBe(password);

    const decrypted = crypto.decrypt(saved.password);
    expect(decrypted).toBe(password);

    const chat = await chatResolver.getChatByIdAndPassword(saved.id, saved.password);
    expect(chat).toBeUndefined();
  });

  test("getChatByIdAndPassword: don't get chat data", async () => {
    const { ChatResolver } = await import("@www/resolvers/chat");
    const chatResolver = new ChatResolver();

    const id = 9999;
    const password = "password";

    const chat = await chatResolver.getChatByIdAndPassword(id, password);
    expect(chat).toBeUndefined();
  });
});
