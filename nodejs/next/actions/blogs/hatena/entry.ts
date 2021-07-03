import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callEntry } from "@www/libs/fetchs/github/hatena";

export type HatenaEntry = {
  entry: string;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<HatenaEntry>(actionCreator);

export const getEntry = createAsync("THUNKS_BLOGS_HATENA_GET_ENTRY", async (name: string) => {
  try {
    const item = await callEntry(name);
    return item;
  } catch (error) {
    throw new Error(error);
  }
});

export const setEntry = createAsync("THUNKS_BLOGS_HATENA_SET_ENTRY", async (entry: string) => entry);
