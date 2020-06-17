import Dexie from "dexie";

interface AccessTokens {
  token: string;
}

interface Chats {
  id: number;
  password: string;
}

export class DB extends Dexie {
  access_tokens: Dexie.Table<AccessTokens, number>;
  chats: Dexie.Table<Chats, number>;

  constructor() {
    super("syonet");
    this.version(1).stores({
      access_tokens: "token",
      chats: "id, password",
    });

    this.access_tokens = this.table("access_tokens");
    this.chats = this.table("chats");
  }
}

export const db = new DB();
