import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callDeck } from "@www/libs/fetchs/github/speakerdeck";

export type SpeakerdeckImages = {
  images: string[];
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<SpeakerdeckImages>(actionCreator);

export const getImages = createAsync("THUNKS_BLOGS_SPEAKERDECK_GET_IMAGES", async (deskTitle: string) => {
  try {
    const json = await callDeck(deskTitle);

    return json.reduce((accumulator: string[], j) => {
      if (/\.jpg$/.test(j.path))
        accumulator.push(`https://raw.githubusercontent.com/igara/speakerdeck-export/master/${j.path}`);

      return accumulator;
    }, []);
  } catch (error) {
    throw new Error(error);
  }
});

export const setImages = createAsync("THUNKS_BLOGS_SPEAKERDECK_SET_IMAGES", async (deckImages: string[]) => deckImages);
