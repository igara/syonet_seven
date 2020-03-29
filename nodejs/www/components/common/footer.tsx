import { footerStyle, iconStyle } from "@www/styles";
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
        className={iconStyle.hamburger.hamburger_icon}
        onClick={() => {
          dispatch(footerActions.onClickLinkIcon(false));
        }}
      >
        <div className={iconStyle.hamburger.hamburger_mark_top} />
        <div className={iconStyle.hamburger.hamburger_mark} />
        <div className={iconStyle.hamburger.hamburger_mark_bottom} />
      </button>
    </div>
  );
};
