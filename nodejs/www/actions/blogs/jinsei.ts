import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callJinsei } from "@www/libs/fetchs/github/jinsei";

export type Jinsei = {
  jinsei: string;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<Jinsei>(actionCreator);

export const getJinsei = createAsync("THUNKS_BLOGS_JINSEI_GET_JINSEI", async () => {
  try {
    const jinsei = await callJinsei();
    return jinsei;
  } catch (error) {
    throw new Error(error);
  }
});

export const setJinsei = createAsync("THUNKS_BLOGS_JINSEI_SET_JINSEI", async (jinsei: string) => jinsei);
