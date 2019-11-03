import { reducerWithInitialState } from "typescript-fsa-reducers";
import { footerActions } from "@www/actions/common/footer";
import { sidebarActions } from "@www/actions/common/sidebar";

export type SidebarState = {
  dispFlag: boolean;
};

const initialState: SidebarState = {
  dispFlag: false,
};

export const sidebarReducer = reducerWithInitialState(initialState)
  /**
   * LinkIconを押下したときの処理
   */
  .case(footerActions.onClickLinkIcon, state => {
    return { ...state, dispFlag: true };
  })
  /**
   * 閉じるを押下したときの処理
   */
  .case(sidebarActions.onClickClose, state => {
    return { ...state, dispFlag: false };
  })
  /**
   * ホームを押下したときの処理
   */
  .case(sidebarActions.onClickHome, state => {
    return { ...state, dispFlag: false };
  })
  /**
   * ログインを押下したときの処理
   */
  .case(sidebarActions.onClickLogin, state => {
    return { ...state, dispFlag: false };
  })
  /**
   * ログアウトを押下したときの処理
   */
  .case(sidebarActions.onClickLogout, state => {
    return { ...state, SidebarDispFlag: false };
  })
  /**
   * ツールを押下したときの処理
   */
  .case(sidebarActions.onClickTools, state => {
    return { ...state, dispFlag: false };
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
        // eslint-disable-next-line no-undef
        location.reload();
      });
    }
    return { ...state, SidebarDispFlag: false };
  });
