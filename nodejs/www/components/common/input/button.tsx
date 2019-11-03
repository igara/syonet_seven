import { buttonStyle } from "@www/styles";

type Props = {
  children: React.ReactNode;
  OnClickHandler?: Function;
};

/**
 * ボタンを表示するコンポーネント
 */
export const ButtonComponent = (props: Props) => (
  <button className={buttonStyle.button} onClick={event => (props.OnClickHandler ? props.OnClickHandler(event) : null)}>
    {props.children}
  </button>
);
