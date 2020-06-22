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
        {props.auth.id && props.auth.snsID ? (
          <img className={iconStyle.login_user_icon} src={props.auth.imageURL} />
        ) : null}
      </li>
    </ul>
  );
};
