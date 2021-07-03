import actionCreatorFactory from "typescript-fsa";
import { asyncFactory } from "typescript-fsa-redux-thunk";
import { callItems, Item } from "@www/libs/fetchs/github/qiita";

export type QiitaItems = {
  items: Item[];
};

const actionCreator = actionCreatorFactory();
const createAsync = asyncFactory<QiitaItems>(actionCreator);

export const getItems = createAsync("THUNKS_BLOGS_QIITA_GET_ITEMS", async () => {
  try {
    const json = await callItems();
    return json;
  } catch (error) {
    throw new Error(error);
  }
});

export const setItems = createAsync("THUNKS_BLOGS_QIITA_SET_ITEMS", async (items: Item[]) => items);
