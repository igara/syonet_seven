import { reducerWithInitialState } from "typescript-fsa-reducers";
import { setEntries, getEntries, HatenaEntries } from "@www/actions/blogs/hatena/entries";

export type HatenaEntriesData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type HatenaEntriesState = {
  entries: HatenaEntriesData<HatenaEntries>;
};

const initialState: HatenaEntriesState = {
  entries: { data: { entries: [] }, loading: false, error: null },
};

export const hatenaEntriesReducer = reducerWithInitialState(initialState)
  .case(getEntries.async.started, state => {
    return {
      ...state,
      entries: {
        ...state.entries,
        data: { entries: [] },
        loading: true,
        error: null,
      },
    };
  })
  .case(getEntries.async.done, (state, payload) => {
    return {
      ...state,
      entries: {
        ...state.entries,
        data: {
          ...state.entries.data,
          entries: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getEntries.async.failed, (state, payload) => {
    return {
      ...state,
      entries: {
        ...state.entries,
        data: { entries: [] },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(setEntries.async.done, (state, payload) => {
    return {
      ...state,
      entries: {
        ...state.entries,
        data: {
          ...state.entries.data,
          entries: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  });
