import termStyle from "@www/styles/common/term.module.css";
import { ButtonComponent as Button } from "@www/components/common/input/button";
import { termActions } from "@www/actions/common/term";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@www/stores";

/**
 * 利用規約を表示するコンポーネント
 */
export const TermComponent = () => {
  const states = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  return (
    <div className={termStyle.term_wrap_div}>
      <div
        className={`${termStyle.term_overlay_div} ${states.term.chengedDispFlag &&
          (states.term.dispFlag ? termStyle.able : termStyle.hidden)}`}
      >
        <div className={termStyle.term_content}>
          <Button OnClickHandler={() => dispatch(termActions.onClickClose(false))}>閉じる</Button>
          <div>利用規約</div>
          <div>利用上の留意事項</div>
          <ul>
            <li>状態保持の機構としてCookiesを使用しております。</li>
            <li>
              本サイトのログイン機能としてSNSを使用した認証を行なっています。
              その際、SNSのアカウントに紐づいた情報を取得させていただきますので同意の元、ご利用をよろしくお願い致します。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
