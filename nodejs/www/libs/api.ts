import fetch from "isomorphic-fetch";

export type APICallParamOption = {
  body: {} | null;
  method: string;
  url: string;
  token?: string;
};

/**
 * APIにリクエストする
 */
export const call = async ({ url, body, method, token }: APICallParamOption) => {
  const bodyString = body ? JSON.stringify(body) : null;
  if (token) {
    return await fetch(url, {
      body: bodyString,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: method,
    });
  }

  return await fetch(url, {
    body: bodyString,
    method: method,
  });
};
