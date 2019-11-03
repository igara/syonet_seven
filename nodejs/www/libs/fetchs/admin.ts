import { call } from "@www/libs/api";

/**
 * ユーザ一覧を取得
 */
export const callUserList = async (params?: { limit: number; next: number }) => {
  const limit = typeof params !== "undefined" && params.limit ? params.limit : 1;
  const next = typeof params !== "undefined" && params.next ? params.next : 1;
  const result = await call({
    url: `${process.env.WWW_HOST}/api/admin/user/?limit=${limit}&next=${next}`,
    method: "GET",
    body: null,
  });
  const json = await result.json();
  return json;
};
