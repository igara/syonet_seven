import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export const authActions = {
  checkAuth: actionCreator<{
    id: number;
    snsID: string;
    username: string;
    imageURL: string;
    type: "" | "AuthGoogle" | "AuthGithub" | "AuthFacebook";
    __typename: "Auth";
  }>("ACTIONS_AUTH_CHECK_AUTH"),
};
