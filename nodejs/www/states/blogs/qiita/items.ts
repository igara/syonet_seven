import { reducerWithInitialState } from "typescript-fsa-reducers";
import { setItems, getItems, QiitaItems } from "@www/actions/blogs/qiita";

export type QiitaItemsData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type QiitaItemsState = {
  items: QiitaItemsData<QiitaItems>;
};

const initialState: QiitaItemsState = {
  items: { data: { items: [] }, loading: false, error: null },
};

export const qiitaItemsReducer = reducerWithInitialState(initialState)
  .case(getItems.async.started, state => {
    return {
      ...state,
      items: {
        ...state.items,
        data: { items: [] },
        loading: true,
        error: null,
      },
    };
  })
  .case(getItems.async.done, (state, payload) => {
    return {
      ...state,
      items: {
        ...state.items,
        data: {
          ...state.items.data,
          items: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getItems.async.failed, (state, payload) => {
    return {
      ...state,
      items: {
        ...state.items,
        data: { items: [] },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(setItems.async.done, (state, payload) => {
    return {
      ...state,
      items: {
        ...state.items,
        data: {
          ...state.items.data,
          items: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  });
