import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { sidebarReducer, SidebarState } from "@www/states/common/sidebar";
import { termReducer, TermState } from "@www/states/common/term";
import { loginReducer, LoginState } from "@www/states/common/login";
import { QiitaItemsState, qiitaItemsReducer } from "@www/states/blogs/qiita/items";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";

export type AppState = {
  sidebar: SidebarState;
  term: TermState;
  login: LoginState;
  qiitaItems: QiitaItemsState;
};

export const rootReducer = () =>
  combineReducers<AppState>({
    sidebar: sidebarReducer,
    term: termReducer,
    login: loginReducer,
    qiitaItems: qiitaItemsReducer,
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
