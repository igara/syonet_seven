import gql from "graphql-tag";

export type CreateSound = {
  createSound: {
    message: "Registed" | "OK";
  };
};

export const CREATE_SOUND = gql`
  mutation CreateSound($name: String!, $artist: String!, $peaks: String!) {
    createSound(name: $name, artist: $artist, peaks: $peaks) {
      message
    }
  }
`;

export type SearchSound = {
  searchSound: {
    name: string;
    artist: string;
  };
};

export const SEARCH_SOUND = gql`
  query SearchSound($peaks: String!) {
    searchSound(peaks: $peaks) {
      name
      artist
    }
  }
`;
