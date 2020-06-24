import "reflect-metadata";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Chat } from "@www/models/typeorm/entities/chat";
import { encrypt } from "@www/libs/crypto";

@Resolver(Chat)
export class ChatResolver {
  @Query(() => Chat, { nullable: true })
  async getChatByIdAndPassword(@Arg("id") id: number, @Arg("password") password: string): Promise<Chat | undefined> {
    const cipheredText = encrypt(password);

    return Chat.findOne({ id, password: cipheredText });
  }

  @Mutation(() => Chat, { nullable: true })
  async createChat(@Arg("name") name: string, @Arg("password") password: string): Promise<Chat> {
    const cipheredText = encrypt(password);

    const chat = Chat.create({ name, password: cipheredText });
    return chat.save();
  }
}
