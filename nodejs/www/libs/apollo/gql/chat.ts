import gql from "graphql-tag";

export type GetChatByIdAndPassword = {
  getChatByIdAndPassword: {
    id: number;
    name: string;
    password: string;
    __typename: "Chat";
  };
};

export const GET_CHAT_BY_ID_AND_PASSWORD = gql`
  query GetChatByIdAndPassword($id: Float!, $password: String!) {
    getChatByIdAndPassword(id: $id, password: $password) {
      id
      name
      password
    }
  }
`;

export type CreateChat = {
  createChat: {
    id: number;
    name: string;
    password: string;
    __typename: "Chat";
  };
};

export const CREATE_CHAT = gql`
  mutation CreateChat($password: String!, $name: String!) {
    createChat(password: $password, name: $name) {
      id
      name
      password
    }
  }
`;
