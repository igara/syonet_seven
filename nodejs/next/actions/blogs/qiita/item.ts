import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callItem } from "@www/libs/fetchs/github/qiita";

export type QiitaItem = {
  item: string;
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<QiitaItem>(actionCreator);

export const getItem = createAsync("THUNKS_BLOGS_QIITA_GET_ITEM", async (name: string) => {
  try {
    const item = await callItem(name);
    return item;
  } catch (error) {
    throw new Error(error);
  }
});

export const setItem = createAsync("THUNKS_BLOGS_QIITA_SET_ITEM", async (item: string) => item);
