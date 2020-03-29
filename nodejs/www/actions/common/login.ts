import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callLoginCheck, callLogout } from "@www/libs/fetchs/auth";

export type Login = {
  status: number;
  user: { image: string; displayName: string } | null;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<Login>(actionCreator);

export const checkLogin = createAsync("THUNKS_LOGIN_CHECK_LOGIN", async (token: string) => {
  try {
    const json = await callLoginCheck(token);
    return json;
  } catch (error) {
    throw new Error(error);
  }
});

export const logout = createAsync("THUNKS_LOGIN_LOGOUT", async (token: string) => {
  try {
    const json = await callLogout(token);
    return json;
  } catch (error) {
    throw new Error(error);
  }
});
