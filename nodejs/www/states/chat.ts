import { reducerWithInitialState } from "typescript-fsa-reducers";
import { createChat, getChat, Chat } from "@www/actions/tools/chat";

export type ChatData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type ChatState = {
  chat: ChatData<Chat>;
};

const initialState: ChatState = {
  chat: {
    data: {
      status: 0,
      chat: {
        _id: "",
        name: "",
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    loading: false,
    error: null,
  },
};

export const chatReducer = reducerWithInitialState(initialState)
  .case(getChat.async.started, state => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: true,
        error: null,
      },
    };
  })
  .case(getChat.async.done, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        data: {
          ...state.chat.data,
          ...payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getChat.async.failed, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(createChat.async.started, state => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: true,
        error: null,
      },
    };
  })
  .case(createChat.async.done, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        data: {
          ...state.chat.data,
          ...payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(createChat.async.failed, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: false,
        error: payload.error,
      },
    };
  });
