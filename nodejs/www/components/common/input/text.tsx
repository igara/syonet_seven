import textStyle from "@www/styles/common/input/text.module.css";

type Props = {
  OnChangeHandler?: Function;
  DefalutValue: string;
  Placeholder: string;
};

/**
 * 入力フォームを表示するコンポーネント
 */
export const TextComponent = (props: Props) => (
  <input
    type="text"
    className={textStyle.text}
    onChange={event => (props.OnChangeHandler ? props.OnChangeHandler(event) : null)}
    placeholder={props.Placeholder}
    defaultValue={props.DefalutValue}
  />
);
