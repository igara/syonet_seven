import { call } from "@www/libs/api";

export const callSpreadsheetList = async (token: string) => {
  const result = await call({
    url: `${process.env.WWW_HOST}/api/spreadsheet/list`,
    method: "GET",
    body: null,
    token: token,
  });
  const json = await result.json();
  return json;
};
