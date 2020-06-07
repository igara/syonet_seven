import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { ChatData } from "@www/models/mongoose/chat";
import { callSFUChat, callCreateSFUChat } from "@www/libs/fetchs/tools/sfu_chat";

export type SFUChat = {
  status: number;
  chat: ChatData;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<SFUChat>(actionCreator);

type GetSFUChatParam = {
  id: string;
  password: string;
};

export const getSFUChat = createAsync<GetSFUChatParam, SFUChat, Error>("THUNKS_SFU_CHAT_GET_SFU_CHAT", async param => {
  try {
    const json = await callSFUChat(param.id, param.password);
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

type CreateSFUChatParam = {
  name: string;
  password: string;
};

export const createSFUChat = createAsync<CreateSFUChatParam, SFUChat>(
  "THUNKS_SFU_CHAT_CREATE_SFU_CHAT",
  async param => {
    try {
      const json = await callCreateSFUChat(param.name, param.password);
      const chat = {
        status: json.status,
        chat: json.chat,
      };
      return chat;
    } catch (error) {
      throw new Error(error);
    }
  },
);
