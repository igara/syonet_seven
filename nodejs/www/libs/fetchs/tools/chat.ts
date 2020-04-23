import { call } from "@www/libs/api";
import * as Chat from "@www/models/mongoose/chat";

type GetChat = {
  status: number;
  message: "OK" | "NG";
  chat: Chat.ChatData;
};

export const callChat = async (id: string, password: string): Promise<GetChat> => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/tools/chat/get`,
    method: "POST",
    body: { id, password },
  });
  const json = await result.json();
  return json;
};

export const callCreateChat = async (name: string, password: string): Promise<GetChat> => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/tools/chat/create`,
    method: "POST",
    body: { name, password },
  });
  const json = await result.json();
  return json;
};
