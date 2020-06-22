import gql from "graphql-tag";

export type CheckAuth = {
  checkAuth: {
    id: number;
    snsID: string;
    username: string;
    imageURL: string;
    type: "" | "AuthGoogle" | "AuthGithub" | "AuthFacebook";
    __typename: "Auth";
  };
};

export const CHECK_AUTH = gql`
  query {
    checkAuth {
      id
      snsID
      username
      imageURL
      type
    }
  }
`;
