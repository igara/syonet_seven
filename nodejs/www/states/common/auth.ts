import { reducerWithInitialState } from "typescript-fsa-reducers";
import { authActions } from "@www/actions/common/auth";

export type AuthState = {
  id: number;
  snsID: string;
  username: string;
  imageURL: string;
  type: "" | "AuthGoogle" | "AuthGithub" | "AuthFacebook";
  __typename: "Auth";
};

const initialState: AuthState = {
  id: 0,
  snsID: "",
  username: "",
  imageURL: "",
  type: "",
  __typename: "Auth",
};

export const authReducer = reducerWithInitialState(initialState).case(authActions.checkAuth, (state, payload) => {
  return { ...state, ...payload };
});
