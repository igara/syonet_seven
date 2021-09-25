import { reducerWithInitialState } from "typescript-fsa-reducers";
import { setItem, getItem, QiitaItem } from "@www/actions/blogs/qiita/item";

export type QiitaItemData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type QiitaItemState = {
  item: QiitaItemData<QiitaItem>;
};

const initialState: QiitaItemState = {
  item: { data: { item: "" }, loading: false, error: null },
};

export const qiitaItemReducer = reducerWithInitialState(initialState)
  .case(getItem.async.started, state => {
    return {
      ...state,
      item: {
        ...state.item,
        data: { item: "" },
        loading: true,
        error: null,
      },
    };
  })
  .case(getItem.async.done, (state, payload) => {
    return {
      ...state,
      item: {
        ...state.item,
        data: {
          ...state.item.data,
          item: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getItem.async.failed, (state, payload) => {
    return {
      ...state,
      item: {
        ...state.item,
        data: { item: "" },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(setItem.async.done, (state, payload) => {
    return {
      ...state,
      item: {
        ...state.item,
        data: {
          ...state.item.data,
          item: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  });
