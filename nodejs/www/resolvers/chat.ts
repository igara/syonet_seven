import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { connect as connectTypeORM } from "@www/models/typeorm/connection";
import { Chat } from "@www/models/typeorm/entities/chat";
import { encrypt, decrypt } from "@www/libs/crypto";

@Resolver(Chat)
export class ChatResolver {
  @Query(() => Chat, { nullable: true })
  async getChatByIdAndPassword(@Arg("id") id: number, @Arg("password") password: string): Promise<Chat | undefined> {
    const connect = await connectTypeORM();
    Chat.useConnection(connect);

    const chat = await Chat.findOne({ id });

    if (!chat) return undefined;

    const decryptedPassword = decrypt(chat.password);
    if (decryptedPassword !== password) return undefined;

    return chat;
  }

  @Mutation(() => Chat, { nullable: true })
  async createChat(@Arg("name") name: string, @Arg("password") password: string): Promise<Chat> {
    const cipheredText = encrypt(password);

    const connect = await connectTypeORM();
    Chat.useConnection(connect);

    const chat = Chat.create({ name, password: cipheredText });

    return chat.save();
  }
}
