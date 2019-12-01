import Dexie from "dexie";

export class DB extends Dexie {
  access_tokens: Dexie.Table<AccessTokens, number>;

  constructor() {
    super("syonet");
    this.version(1).stores({
      access_tokens: "token",
    });

    this.access_tokens = this.table("access_tokens");
  }
}

interface AccessTokens {
  token: string;
}

export const db = new DB();
