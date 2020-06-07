import { reducerWithInitialState } from "typescript-fsa-reducers";
import { createSFUChat, getSFUChat, SFUChat } from "@www/actions/tools/sfu_chat";

export type SFUChatData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type SFUChatState = {
  chat: SFUChatData<SFUChat>;
};

const initialState: SFUChatState = {
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

export const sfuChatReducer = reducerWithInitialState(initialState)
  .case(getSFUChat.async.started, state => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: true,
        error: null,
      },
    };
  })
  .case(getSFUChat.async.done, (state, payload) => {
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
  .case(getSFUChat.async.failed, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(createSFUChat.async.started, state => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: true,
        error: null,
      },
    };
  })
  .case(createSFUChat.async.done, (state, payload) => {
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
  .case(createSFUChat.async.failed, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: false,
        error: payload.error,
      },
    };
  });
