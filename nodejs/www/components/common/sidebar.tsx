import Link from "next/link";
import { sidebarStyle, iconStyle } from "@www/styles";
import { sidebarActions } from "@www/actions/common/sidebar";
import { logout } from "@www/actions/common/login";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@www/stores";
import { Cookies } from "@www/libs/cookie";

type Props = AppState;

/**
 * サイドバーを表示するコンポーネント
 */
export const SidebarComponent = (props: Props) => {
  const states = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  return (
    <div className={`${sidebarStyle.sidebar_wrap_div} ${states.sidebar.dispFlag ? "" : sidebarStyle.hidden}`}>
      <div className={sidebarStyle.sidebar_overlay_div} />
      <ul className={sidebarStyle.sidebar_link_wrap_ul}>
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickClose(false))}>
          閉じる
        </li>
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickHome(false))}>
          <Link href="/" as="/">
            <a>ホーム</a>
          </Link>
        </li>
        {props.login.login.data.user ? (
          <li
            className={sidebarStyle.sidebar_link_list}
            onClick={() => {
              const cookies = Cookies();
              const sessionId = cookies.get("connect.sid");
              if (sessionId) {
                const token = `connect.sid=${sessionId}`;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dispatch<any>(logout.action(token));
              }
            }}
          >
            ログアウト
          </li>
        ) : (
          <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickLogin(false))}>
            <Link href="/login" as="/login">
              <a>ログイン</a>
            </Link>
          </li>
        )}
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickTools(false))}>
          <Link href="/tools" as="/tools">
            <a>ツール</a>
          </Link>
        </li>
        <li className={sidebarStyle.sidebar_link_list} onClick={() => dispatch(sidebarActions.onClickTerm(true))}>
          利用規約
        </li>
        <li className={sidebarStyle.sidebar_link_list}>
          <a href="https://github.com/igara/syonet_seven" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li
          className={sidebarStyle.sidebar_link_list}
          onClick={() => dispatch(sidebarActions.onClickCacheClear(false))}
        >
          キャッシュクリア
        </li>
      </ul>
      <button className={iconStyle.close.close_icon} onClick={() => dispatch(sidebarActions.onClickClose(false))}>
        <div className={iconStyle.close.close_mark} />
      </button>
    </div>
  );
};
