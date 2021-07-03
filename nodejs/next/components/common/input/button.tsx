import buttonStyle from "@www/styles/common/input/button.module.css";

type Props = {
  children: React.ReactNode;
  OnClickHandler?: Function;
  Abled?: boolean;
};

/**
 * ボタンを表示するコンポーネント
 */
export const ButtonComponent = (props: Props) => (
  <button
    className={buttonStyle.button}
    onClick={event => (props.OnClickHandler ? props.OnClickHandler(event) : null)}
    disabled={props.Abled}
  >
    {props.children}
  </button>
);
