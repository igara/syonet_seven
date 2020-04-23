import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { ChatData } from "@www/models/mongoose/chat";
import { callChat, callCreateChat } from "@www/libs/fetchs/tools/chat";

export type Chat = {
  status: number;
  chat: ChatData;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<Chat>(actionCreator);

type GetChatParam = {
  id: string;
  password: string;
};

export const getChat = createAsync<GetChatParam, Chat, Error>("THUNKS_CHAT_GET_CHAT", async param => {
  try {
    const json = await callChat(param.id, param.password);
    const chat = {
      status: json.status,
      chat: json.chat,
    };

    if (chat.status !== 200) throw new Error("not found chat");
    return chat;
  } catch (error) {
    throw new Error(error);
  }
});

type CreateChatParam = {
  name: string;
  password: string;
};

export const createChat = createAsync<CreateChatParam, Chat>("THUNKS_CHAT_CREATE_CHAT", async param => {
  try {
    const json = await callCreateChat(param.name, param.password);
    const chat = {
      status: json.status,
      chat: json.chat,
    };
    return chat;
  } catch (error) {
    throw new Error(error);
  }
});
