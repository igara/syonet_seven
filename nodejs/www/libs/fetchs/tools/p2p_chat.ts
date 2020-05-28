import { call } from "@www/libs/api";
import * as Chat from "@www/models/mongoose/chat";

type GetP2PChat = {
  status: number;
  message: "OK" | "NG";
  chat: Chat.ChatData;
};

export const callP2PChat = async (id: string, password: string): Promise<GetP2PChat> => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/tools/p2p_chat/get`,
    method: "POST",
    body: { id, password },
  });
  const json = await result.json();
  return json;
};

export const callCreateP2PChat = async (name: string, password: string): Promise<GetP2PChat> => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/tools/p2p_chat/create`,
    method: "POST",
    body: { name, password },
  });
  const json = await result.json();
  return json;
};
