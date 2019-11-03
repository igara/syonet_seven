import { call } from "@www/libs/api";

/**
 * ログインチェックを行う
 */
export const callLoginCheck = async (token: string) => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/auth/check`,
    method: "GET",
    body: null,
    token: token,
  });
  const json = await result.json();
  return json;
};

/**
 * ログアウトを行う
 */
export const callLogout = async (token: string) => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/auth/delete`,
    method: "DELETE",
    body: {},
    token: token,
  });
  const json = await result.json();
  return json;
};

export const callAuthAdminCheck = async () => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/auth/admin/check`,
    method: "GET",
    body: {},
  });
  const json = await result.json();
  return json;
};
