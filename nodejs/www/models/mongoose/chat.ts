import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";

export type ChatData = {
  _id: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface ChatDocument extends Document {
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new mongoose.Schema(
  {
    name: String,
    password: String,
    created_at: {
      type: Date,
      default: Date.now,
      alias: "createdAt",
    },
    updated_at: {
      type: Date,
      default: Date.now,
      alias: "updatedAt",
    },
  },
  {
    collection: "chats",
  },
);

export const getChatList = async (): Promise<ChatDocument[]> => {
  const result = await Chat.find({});
  return result;
};
ChatSchema.methods.getChatList = getChatList;

export const getChat = async (id: string, password: string): Promise<ChatDocument> => {
  const key = crypto.scryptSync(password, process.env.TOKEN_SECRET, 32);
  const iv = Array.from(crypto.randomFillSync(new Uint8Array(16)))
    .map(n => process.env.TOKEN_SECRET[n % process.env.TOKEN_SECRET.length])
    .join("");
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  cipher.update(process.env.TOKEN_SECRET, "utf8", "hex");
  const cipheredText = cipher.final("hex");
  const result = await Chat.findOne({ _id: id, password: cipheredText });
  return result;
};
ChatSchema.methods.getChat = getChat;

export const createChat = async (name: string, password: string): Promise<ChatDocument> => {
  const key = crypto.scryptSync(password, process.env.TOKEN_SECRET, 32);
  const iv = Array.from(crypto.randomFillSync(new Uint8Array(16)))
    .map(n => process.env.TOKEN_SECRET[n % process.env.TOKEN_SECRET.length])
    .join("");
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  cipher.update(process.env.TOKEN_SECRET, "utf8", "hex");
  const cipheredText = cipher.final("hex");
  const result = await Chat.create({ name, password: cipheredText });
  return result;
};
ChatSchema.methods.createChat = createChat;

const Chat = mongoose.models.Chat || mongoose.model<ChatDocument>("Chat", ChatSchema);
export default Chat;
