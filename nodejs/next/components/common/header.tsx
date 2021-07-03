import headerStyle from "@www/styles/common/header.module.css";
import iconStyle from "@www/styles/common/icon.module.css";
import syonetSvg from "@www/images/syonet.svg";
import { useSelector } from "react-redux";
import { AppState } from "@www/stores";

/**
 * ヘッダーを表示するコンポーネント
 */
export const HeaderComponent = () => {
  const authID = useSelector<AppState, number>(state => state.auth.id);
  const authSNSID = useSelector<AppState, string>(state => state.auth.snsID);
  const authImageURL = useSelector<AppState, string>(state => state.auth.imageURL);

  return (
    <ul className={headerStyle.header_wrap_ul}>
      <li dangerouslySetInnerHTML={{ __html: syonetSvg }} />
      <li>{authID && authSNSID ? <img className={iconStyle.login_user_icon} src={authImageURL} /> : null}</li>
    </ul>
  );
};
