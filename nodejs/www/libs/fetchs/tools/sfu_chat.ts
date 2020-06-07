import { call } from "@www/libs/api";
import * as Chat from "@www/models/mongoose/chat";

type GetSFUChat = {
  status: number;
  message: "OK" | "NG";
  chat: Chat.ChatData;
};

export const callSFUChat = async (id: string, password: string): Promise<GetSFUChat> => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/tools/sfu_chat/get`,
    method: "POST",
    body: { id, password },
  });
  const json = await result.json();
  return json;
};

export const callCreateSFUChat = async (name: string, password: string): Promise<GetSFUChat> => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/tools/sfu_chat/create`,
    method: "POST",
    body: { name, password },
  });
  const json = await result.json();
  return json;
};
