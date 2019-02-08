import * as React from "react";
import { TextStyle } from "@F_syonet/styles";

interface OwnProps {
	OnChangeHandler?: Function;
	DefalutValue: string;
	Placeholder: string;
}

/**
 * 入力フォームを表示するコンポーネント
 */
export const TextComponent: React.SFC<OwnProps> = (props: OwnProps) => {
	return (
		<input
			type="text"
			className={TextStyle.text}
			onChange={event =>
				props.OnChangeHandler ? props.OnChangeHandler(event) : null
			}
			placeholder={props.Placeholder}
			defaultValue={props.DefalutValue}
		/>
	);
};
