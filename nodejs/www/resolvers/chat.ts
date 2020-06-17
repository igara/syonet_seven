import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Chat } from "@www/models/typeorm/entities/chat";
import crypto from "crypto";

const TOKEN_SECRET = process.env.TOKEN_SECRET || "";

@Resolver(Chat)
export class ChatResolver {
  @Query(() => Chat, { nullable: true })
  async getChatByIdAndPassword(@Arg("id") id: number, @Arg("password") password: string): Promise<Chat | undefined> {
    const key = crypto.scryptSync(password, TOKEN_SECRET, 32);
    const iv = Array.from(crypto.randomFillSync(new Uint8Array(16)))
      .map(n => TOKEN_SECRET[n % TOKEN_SECRET.length])
      .join("");
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    cipher.update(TOKEN_SECRET, "utf8", "hex");
    const cipheredText = cipher.final("hex");

    return Chat.findOne({ id, password: cipheredText });
  }

  @Mutation(() => Chat, { nullable: true })
  async createChat(@Arg("name") name: string, @Arg("password") password: string): Promise<Chat> {
    const key = crypto.scryptSync(password, TOKEN_SECRET, 32);
    const iv = Array.from(crypto.randomFillSync(new Uint8Array(16)))
      .map(n => TOKEN_SECRET[n % TOKEN_SECRET.length])
      .join("");
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    cipher.update(TOKEN_SECRET, "utf8", "hex");
    const cipheredText = cipher.final("hex");

    const chat = Chat.create({ name, password: cipheredText });
    return chat.save();
  }
}
