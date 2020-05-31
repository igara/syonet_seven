import { reducerWithInitialState } from "typescript-fsa-reducers";
import { setJinsei, getJinsei, Jinsei } from "@www/actions/blogs/jinsei";

export type JinseiData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type JinseiState = {
  jinsei: JinseiData<Jinsei>;
};

const initialState: JinseiState = {
  jinsei: { data: { jinsei: "" }, loading: false, error: null },
};

export const jinseiReducer = reducerWithInitialState(initialState)
  .case(getJinsei.async.started, state => {
    return {
      ...state,
      jinsei: {
        ...state.jinsei,
        data: { jinsei: "" },
        loading: true,
        error: null,
      },
    };
  })
  .case(getJinsei.async.done, (state, payload) => {
    return {
      ...state,
      jinsei: {
        ...state.jinsei,
        data: {
          ...state.jinsei.data,
          jinsei: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getJinsei.async.failed, (state, payload) => {
    return {
      ...state,
      jinsei: {
        ...state.jinsei,
        data: { jinsei: "" },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(setJinsei.async.done, (state, payload) => {
    return {
      ...state,
      jinsei: {
        ...state.jinsei,
        data: {
          ...state.jinsei.data,
          jinsei: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  });
