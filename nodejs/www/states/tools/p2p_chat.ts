import { reducerWithInitialState } from "typescript-fsa-reducers";
import { createP2PChat, getP2PChat, P2PChat } from "@www/actions/tools/p2p_chat";

export type P2PChatData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type P2PChatState = {
  chat: P2PChatData<P2PChat>;
};

const initialState: P2PChatState = {
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

export const p2pChatReducer = reducerWithInitialState(initialState)
  .case(getP2PChat.async.started, state => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: true,
        error: null,
      },
    };
  })
  .case(getP2PChat.async.done, (state, payload) => {
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
  .case(getP2PChat.async.failed, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(createP2PChat.async.started, state => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: true,
        error: null,
      },
    };
  })
  .case(createP2PChat.async.done, (state, payload) => {
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
  .case(createP2PChat.async.failed, (state, payload) => {
    return {
      ...state,
      chat: {
        ...state.chat,
        loading: false,
        error: payload.error,
      },
    };
  });
