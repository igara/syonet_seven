import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { sidebarReducer, SidebarState } from "@www/states/common/sidebar";
import { termReducer, TermState } from "@www/states/common/term";
import { loginReducer, LoginState } from "@www/states/common/login";
import { QiitaItemsState, qiitaItemsReducer } from "@www/states/blogs/qiita/items";
import { QiitaItemState, qiitaItemReducer } from "@www/states/blogs/qiita/item";
import { HatenaEntriesState, hatenaEntriesReducer } from "@www/states/blogs/hatena/entries";
import { HatenaEntryState, hatenaEntryReducer } from "@www/states/blogs/hatena/entry";
import { ChatState, chatReducer } from "@www/states/chat";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";

export type AppState = {
  sidebar: SidebarState;
  term: TermState;
  login: LoginState;
  qiitaItems: QiitaItemsState;
  qiitaItem: QiitaItemState;
  hatenaEntries: HatenaEntriesState;
  hatenaEntry: HatenaEntryState;
  chat: ChatState;
};

export const rootReducer = () =>
  combineReducers<AppState>({
    sidebar: sidebarReducer,
    term: termReducer,
    login: loginReducer,
    qiitaItems: qiitaItemsReducer,
    qiitaItem: qiitaItemReducer,
    hatenaEntries: hatenaEntriesReducer,
    hatenaEntry: hatenaEntryReducer,
    chat: chatReducer,
  });

export const store = () =>
  createStore(
    rootReducer(),
    process.env.NODE_ENV !== "production"
      ? compose(
          applyMiddleware(thunk),
          composeWithDevTools(applyMiddleware(logger)),
        )
      : compose(applyMiddleware(thunk)),
  );
export default store;
