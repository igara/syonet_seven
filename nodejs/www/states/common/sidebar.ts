import { reducerWithInitialState } from "typescript-fsa-reducers";
import { footerActions } from "@www/actions/common/footer";
import { sidebarActions } from "@www/actions/common/sidebar";

export type SidebarState = {
  dispFlag: boolean;
  chengedDispFlag: boolean;
};

const initialState: SidebarState = {
  dispFlag: false,
  chengedDispFlag: false,
};

export const sidebarReducer = reducerWithInitialState(initialState)
  /**
   * LinkIconを押下したときの処理
   */
  .case(footerActions.onClickLinkIcon, state => {
    return { ...state, dispFlag: true, chengedDispFlag: true };
  })
  /**
   * 閉じるを押下したときの処理
   */
  .case(sidebarActions.onClickClose, state => {
    return { ...state, dispFlag: false, chengedDispFlag: true };
  })
  /**
   * ホームを押下したときの処理
   */
  .case(sidebarActions.onClickHome, state => {
    return { ...state, dispFlag: false, chengedDispFlag: true };
  })
  /**
   * ログインを押下したときの処理
   */
  .case(sidebarActions.onClickLogin, state => {
    return { ...state, dispFlag: false, chengedDispFlag: true };
  })
  /**
   * ログアウトを押下したときの処理
   */
  .case(sidebarActions.onClickLogout, state => {
    return { ...state, dispFlag: false, chengedDispFlag: true };
  })
  /**
   * ツールを押下したときの処理
   */
  .case(sidebarActions.onClickTools, state => {
    return { ...state, dispFlag: false, chengedDispFlag: true };
  })
  /**
   * キャッシュクリアを押下した時
   */
  .case(sidebarActions.onClickCacheClear, state => {
    // eslint-disable-next-line no-undef
    if (typeof navigator !== "undefined" && typeof navigator.serviceWorker !== "undefined") {
      // eslint-disable-next-line no-undef
      navigator.serviceWorker.getRegistrations().then(registrations => {
        // 登録されているworkerを全て削除する
        registrations.forEach(registration => {
          registration.unregister();
        });
        // eslint-disable-next-line no-undef
        caches.keys().then(keys => {
          // キャッシュストレージを全て削除する
          keys.forEach(cacheName => {
            if (cacheName) {
              // eslint-disable-next-line no-undef
              caches.delete(cacheName);
            }
          });
        });
      });
    }
    return { ...state, dispFlag: false };
  });
