import footerStyle from "@www/styles/common/footer.module.css";
import hamburgerIconStyle from "@www/styles/common/icon/hamburger.module.css";
import { footerActions } from "@www/actions/common/footer";
import { useDispatch } from "react-redux";

/**
 * フッダーを表示するコンポーネント
 */
export const FooterComponent = () => {
  const dispatch = useDispatch();
  return (
    <div className={footerStyle.footer_wrap_div}>
      <button
        className={hamburgerIconStyle.hamburger_icon}
        onClick={() => {
          dispatch(footerActions.onClickLinkIcon(false));
        }}
      >
        <div className={hamburgerIconStyle.hamburger_mark_top} />
        <div className={hamburgerIconStyle.hamburger_mark} />
        <div className={hamburgerIconStyle.hamburger_mark_bottom} />
      </button>
    </div>
  );
};
