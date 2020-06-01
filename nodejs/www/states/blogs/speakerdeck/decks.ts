import { reducerWithInitialState } from "typescript-fsa-reducers";
import { setDecks, getDecks, SpeakerdeckDecks } from "@www/actions/blogs/speakerdeck/decks";

export type SpeakerdeckDecksData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type SpeakerdeckDesksState = {
  decks: SpeakerdeckDecksData<SpeakerdeckDecks>;
};

const initialState: SpeakerdeckDesksState = {
  decks: { data: { decks: [] }, loading: false, error: null },
};

export const speakerdeckDesksReducer = reducerWithInitialState(initialState)
  .case(getDecks.async.started, state => {
    return {
      ...state,
      decks: {
        ...state.decks,
        data: { decks: [] },
        loading: true,
        error: null,
      },
    };
  })
  .case(getDecks.async.done, (state, payload) => {
    return {
      ...state,
      decks: {
        ...state.decks,
        data: {
          ...state.decks.data,
          decks: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getDecks.async.failed, (state, payload) => {
    return {
      ...state,
      decks: {
        ...state.decks,
        data: { decks: [] },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(setDecks.async.done, (state, payload) => {
    return {
      ...state,
      decks: {
        ...state.decks,
        data: {
          ...state.decks.data,
          decks: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  });
