import textareaStyle from "@www/styles/common/input/textarea.module.css";

type Props = {
  OnChangeHandler?: Function;
  DefalutValue: string;
  Placeholder: string;
  ClassName: string;
  ReadOnly?: boolean;
};

/**
 * 入力フォームを表示するコンポーネント
 */
export const TextAreaComponent = (props: Props) => (
  <textarea
    className={`${textareaStyle.textarea} ${props.ClassName}`}
    onChange={event => (props.OnChangeHandler ? props.OnChangeHandler(event) : null)}
    placeholder={props.Placeholder}
    defaultValue={props.DefalutValue}
    readOnly={Boolean(props.ReadOnly)}
  />
);
