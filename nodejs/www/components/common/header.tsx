import headerStyle from "@www/styles/common/header.module.css";
import iconStyle from "@www/styles/common/icon.module.css";
import syonetSvg from "@www/images/syonet.svg";
import { AppState } from "@www/stores";

type Props = AppState;

/**
 * ヘッダーを表示するコンポーネント
 */
export const HeaderComponent = (props: Props) => {
  return (
    <ul className={headerStyle.header_wrap_ul}>
      <li dangerouslySetInnerHTML={{ __html: syonetSvg }} />
      <li>
        {props.login.login.data.user ? (
          <img className={iconStyle.login_user_icon} src={props.login.login.data.user.image} />
        ) : null}
      </li>
    </ul>
  );
};
