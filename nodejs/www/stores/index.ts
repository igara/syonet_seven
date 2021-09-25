import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { sidebarReducer, SidebarState } from "@www/states/common/sidebar";
import { termReducer, TermState } from "@www/states/common/term";
import { authReducer, AuthState } from "@www/states/common/auth";
import { QiitaItemsState, qiitaItemsReducer } from "@www/states/blogs/qiita/items";
import { QiitaItemState, qiitaItemReducer } from "@www/states/blogs/qiita/item";
import { HatenaEntriesState, hatenaEntriesReducer } from "@www/states/blogs/hatena/entries";
import { HatenaEntryState, hatenaEntryReducer } from "@www/states/blogs/hatena/entry";
import { SpeakerdeckDesksState, speakerdeckDesksReducer } from "@www/states/blogs/speakerdeck/decks";
import { SpeakerdeckImagesState, speakerdeckImagesReducer } from "@www/states/blogs/speakerdeck/images";
import { JinseiState, jinseiReducer } from "@www/states/blogs/jinsei";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper, MakeStore } from "next-redux-wrapper";

import logger from "redux-logger";

export type AppState = {
  sidebar: SidebarState;
  term: TermState;
  auth: AuthState;
  qiitaItems: QiitaItemsState;
  qiitaItem: QiitaItemState;
  hatenaEntries: HatenaEntriesState;
  hatenaEntry: HatenaEntryState;
  speakerdeckDesks: SpeakerdeckDesksState;
  speakerdeckImages: SpeakerdeckImagesState;
  jinsei: JinseiState;
};

export const rootReducer = () =>
  combineReducers<AppState>({
    sidebar: sidebarReducer,
    term: termReducer,
    auth: authReducer,
    qiitaItems: qiitaItemsReducer,
    qiitaItem: qiitaItemReducer,
    hatenaEntries: hatenaEntriesReducer,
    hatenaEntry: hatenaEntryReducer,
    speakerdeckDesks: speakerdeckDesksReducer,
    speakerdeckImages: speakerdeckImagesReducer,
    jinsei: jinseiReducer,
  });

export const store: MakeStore<AppState> = () =>
  createStore(
    rootReducer(),
    process.env.NODE_ENV !== "production"
      ? compose(
          applyMiddleware(thunk),
          composeWithDevTools(applyMiddleware(logger)),
        )
      : compose(applyMiddleware(thunk)),
  );

export const wrapper = createWrapper<AppState>(store);
