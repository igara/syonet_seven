import { reducerWithInitialState } from "typescript-fsa-reducers";
import { setEntry, getEntry, HatenaEntry } from "@www/actions/blogs/hatena/entry";

export type HatenaEntryData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type HatenaEntryState = {
  entry: HatenaEntryData<HatenaEntry>;
};

const initialState: HatenaEntryState = {
  entry: { data: { entry: "" }, loading: false, error: null },
};

export const hatenaEntryReducer = reducerWithInitialState(initialState)
  .case(getEntry.async.started, state => {
    return {
      ...state,
      entry: {
        ...state.entry,
        data: { entry: "" },
        loading: true,
        error: null,
      },
    };
  })
  .case(getEntry.async.done, (state, payload) => {
    return {
      ...state,
      entry: {
        ...state.entry,
        data: {
          ...state.entry.data,
          entry: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getEntry.async.failed, (state, payload) => {
    return {
      ...state,
      entry: {
        ...state.entry,
        data: { entry: "" },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(setEntry.async.done, (state, payload) => {
    return {
      ...state,
      entry: {
        ...state.entry,
        data: {
          ...state.entry.data,
          entry: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  });
