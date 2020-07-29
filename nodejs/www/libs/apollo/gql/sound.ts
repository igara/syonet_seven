import gql from "graphql-tag";

export type CreateSound = {
  createSound: {
    message: "Registed" | "OK";
  };
};

export const CREATE_SOUND = gql`
  mutation CreateSound($name: String!, $peaks: String!) {
    createSound(name: $name, peaks: $peaks) {
      message
    }
  }
`;

export type SearchSound = {
  searchSound: {
    message: string;
  };
};

export const SEARCH_SOUND = gql`
  query SearchSound($peaks: String!) {
    searchSound(peaks: $peaks) {
      message
    }
  }
`;
