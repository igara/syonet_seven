import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callSpreadsheetList } from "@www/libs/fetchs/google/spreadsheet";

export type Login = {
  status: number;
  user: { image: string; displayName: string } | null;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<Login>(actionCreator);

export const spreadsheetList = createAsync("THUNKS_TOOLS_SPREADSHEET_LIST", async (token: string) => {
  try {
    const json = await callSpreadsheetList(token);
    return json;
  } catch (error) {
    throw new Error(error);
  }
});
