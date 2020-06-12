import buttonStyle from "@www/styles/common/input/button.module.css";

type Props = {
  Key: string;
  OnInputHandler?: Function;
  Multiple?: boolean;
  Accept: string;
};

/**
 * ファイル入力を表示するコンポーネント
 */
export const FileComponent = (props: Props) => {
  return (
    <button className={buttonStyle.button}>
      <label htmlFor={`file_${props.Key}`}>
        ＋写真を選択
        {props.Multiple === true ? (
          <input
            type="file"
            onChange={event => (props.OnInputHandler ? props.OnInputHandler(event) : null)}
            multiple
            style={{ display: "none" }}
            id={`file_${props.Key}`}
            accept={props.Accept}
          />
        ) : (
          <input
            type="file"
            onChange={event => (props.OnInputHandler ? props.OnInputHandler(event) : null)}
            style={{ display: "none" }}
            id={`file_${props.Key}`}
            accept={props.Accept}
          />
        )}
      </label>
    </button>
  );
};
