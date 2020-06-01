import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callDecks, Deck } from "@www/libs/fetchs/github/speakerdeck";

export type SpeakerdeckDecks = {
  decks: Deck[];
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<SpeakerdeckDecks>(actionCreator);

export const getDecks = createAsync("THUNKS_BLOGS_SPEAKERDECK_GET_DECKS", async () => {
  try {
    const json = await callDecks();
    return json;
  } catch (error) {
    throw new Error(error);
  }
});

export const setDecks = createAsync("THUNKS_BLOGS_SPEAKERDECK_SET_DECKS", async (decks: Deck[]) => decks);
