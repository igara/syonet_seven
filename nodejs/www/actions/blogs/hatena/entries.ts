import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callEntries, Entry } from "@www/libs/fetchs/github/hatena";

export type HatenaEntries = {
  entries: Entry[];
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<HatenaEntries>(actionCreator);

export const getEntries = createAsync("THUNKS_BLOGS_HATENA_GET_ENTRIES", async () => {
  try {
    const json = await callEntries();
    return json;
  } catch (error) {
    throw new Error(error);
  }
});

export const setEntries = createAsync("THUNKS_BLOGS_HATENA_SET_ENTRIES", async (entries: Entry[]) => entries);
