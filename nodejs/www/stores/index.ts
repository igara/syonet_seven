import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { sidebarReducer, SidebarState } from "@www/states/common/sidebar";
import { termReducer, TermState } from "@www/states/common/term";
import { loginReducer, LoginState } from "@www/states/common/login";
import { QiitaItemsState, qiitaItemsReducer } from "@www/states/blogs/qiita/items";
import { QiitaItemState, qiitaItemReducer } from "@www/states/blogs/qiita/item";
import { HatenaEntriesState, hatenaEntriesReducer } from "@www/states/blogs/hatena/entries";
import { HatenaEntryState, hatenaEntryReducer } from "@www/states/blogs/hatena/entry";
import { SpeakerdeckDesksState, speakerdeckDesksReducer } from "@www/states/blogs/speakerdeck/decks";
import { SpeakerdeckImagesState, speakerdeckImagesReducer } from "@www/states/blogs/speakerdeck/images";
import { JinseiState, jinseiReducer } from "@www/states/blogs/jinsei";
import { ChatState, chatReducer } from "@www/states/tools/chat";
import { P2PChatState, p2pChatReducer } from "@www/states/tools/p2p_chat";
import { SFUChatState, sfuChatReducer } from "@www/states/tools/sfu_chat";
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
  speakerdeckDesks: SpeakerdeckDesksState;
  speakerdeckImages: SpeakerdeckImagesState;
  jinsei: JinseiState;
  chat: ChatState;
  p2pChat: P2PChatState;
  sfuChat: SFUChatState;
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
    speakerdeckDesks: speakerdeckDesksReducer,
    speakerdeckImages: speakerdeckImagesReducer,
    jinsei: jinseiReducer,
    chat: chatReducer,
    p2pChat: p2pChatReducer,
    sfuChat: sfuChatReducer,
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
