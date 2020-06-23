import gql from "graphql-tag";

export type GetWebPushKey = {
  getWebPushKey: {
    publicKey: string;
  };
};

export const GET_WEBPUSH_KEY = gql`
  query {
    getWebPushKey {
      publicKey
    }
  }
`;

export type CreateWebPushUser = {
  createWebPushUser: {
    message: "Registed" | "OK";
  };
};

export const CREATE_WEBPUSH_USER = gql`
  mutation CreateWebPushUser($endpoint: String!, $auth: String!, $p256dh: String!) {
    createWebPushUser(endpoint: $endpoint, auth: $auth, p256dh: $p256dh) {
      message
    }
  }
`;
