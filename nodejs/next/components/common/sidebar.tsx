import sidebarStyle from "@www/styles/common/sidebar.module.css";
import closeIconStyle from "@www/styles/common/icon/close.module.css";
import { sidebarActions } from "@www/actions/common/sidebar";
import { termActions } from "@www/actions/common/term";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@www/stores";
import { db } from "@www/models/dexie/db";
import { LinkComponent } from "@www/components/common/link";

/**
 * サイドバーを表示するコンポーネント
 */
export const SidebarComponent = () => {
  const states = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  return (
    <div className={sidebarStyle.sidebar_wrap_div}>
      <div
        className={`${sidebarStyle.sidebar_overlay_div} ${states.sidebar.chengedDispFlag &&
          (states.sidebar.dispFlag ? sidebarStyle.able : sidebarStyle.hidden)}`}
      />

      <ul
        className={`${sidebarStyle.sidebar_link_wrap_ul} ${states.sidebar.chengedDispFlag &&
          (states.sidebar.dispFlag ? sidebarStyle.able : sidebarStyle.hidden)}`}
      >
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickClose(false))}>
          閉じる
        </li>
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickHome(false))}>
          <LinkComponent href="/">ホーム</LinkComponent>
        </li>
        {states.auth.id && states.auth.snsID ? (
          <li
            className={sidebarStyle.sidebar_link_list}
            onClick={async () => {
              if (process.browser) {
                await db.access_tokens.clear();
                await dispatch(sidebarActions.onClickLogout(false));
                location.reload();
              }
            }}
          >
            ログアウト
          </li>
        ) : (
          <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickLogin(false))}>
            <LinkComponent href="/login">ログイン</LinkComponent>
          </li>
        )}
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickTools(false))}>
          <LinkComponent href="/tools">ツール</LinkComponent>
        </li>
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickTools(false))}>
          <LinkComponent href="/blogs">ブログ</LinkComponent>
        </li>
        <li
          className={sidebarStyle.sidebar_link_list}
          onClick={() => {
            dispatch(termActions.onClickOpen());
          }}
        >
          利用規約
        </li>
        <li className={sidebarStyle.sidebar_link_list}>
          <a href="https://github.com/igara/syonet_seven" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li
          className={sidebarStyle.sidebar_link_list}
          onClick={async () => {
            if (process.browser) {
              await db.delete();
              await dispatch(sidebarActions.onClickCacheClear(false));
              location.reload();
            }
          }}
        >
          キャッシュクリア
        </li>
      </ul>
      <button
        className={`${closeIconStyle.close_icon} ${states.sidebar.dispFlag ? "" : closeIconStyle.hidden}`}
        onClick={() => dispatch(sidebarActions.onClickClose(false))}
      >
        <div className={closeIconStyle.close_mark} />
      </button>
    </div>
  );
};
