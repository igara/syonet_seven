import { reducerWithInitialState } from "typescript-fsa-reducers";
import { checkLogin, logout, Login } from "@www/actions/common/login";

export type StoreData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type LoginState = {
  login: StoreData<Login>;
};

const initialState: LoginState = {
  login: { data: { status: 0, user: null }, loading: false, error: null },
};

export const loginReducer = reducerWithInitialState(initialState)
  .case(checkLogin.async.started, state => {
    return {
      ...state,
      login: {
        ...state.login,
        data: { status: 0, user: null },
        loading: true,
        error: null,
      },
    };
  })
  .case(checkLogin.async.done, (state, payload) => {
    return {
      ...state,
      login: {
        ...state.login,
        data: payload.result,
        loading: false,
        error: null,
      },
    };
  })
  .case(checkLogin.async.failed, (state, payload) => {
    return {
      ...state,
      login: {
        ...state.login,
        data: { status: 0, user: null },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(logout.async.started, state => {
    return {
      ...state,
      login: {
        ...state.login,
        loading: true,
        error: null,
      },
    };
  })
  .case(logout.async.done, state => {
    // eslint-disable-next-line no-undef
    location.reload();
    return {
      ...state,
      login: {
        ...state.login,
        data: { status: 0, user: null },
        loading: false,
        error: null,
      },
    };
  })
  .case(logout.async.failed, (state, payload) => {
    return {
      ...state,
      login: {
        ...state.login,
        loading: false,
        error: payload.error,
      },
    };
  });
