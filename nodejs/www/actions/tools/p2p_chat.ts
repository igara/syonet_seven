import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { ChatData } from "@www/models/mongoose/chat";
import { callP2PChat, callCreateP2PChat } from "@www/libs/fetchs/tools/p2p_chat";

export type P2PChat = {
  status: number;
  chat: ChatData;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<P2PChat>(actionCreator);

type GetP2PChatParam = {
  id: string;
  password: string;
};

export const getP2PChat = createAsync<GetP2PChatParam, P2PChat, Error>("THUNKS_P2P_CHAT_GET_P2P_CHAT", async param => {
  try {
    const json = await callP2PChat(param.id, param.password);
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

type CreateP2PChatParam = {
  name: string;
  password: string;
};

export const createP2PChat = createAsync<CreateP2PChatParam, P2PChat>(
  "THUNKS_P2P_CHAT_CREATE_P2P_CHAT",
  async param => {
    try {
      const json = await callCreateP2PChat(param.name, param.password);
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
