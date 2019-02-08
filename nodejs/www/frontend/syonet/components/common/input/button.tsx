import * as React from "react";
import { ButtonStyle } from "@F_syonet/styles";

interface OwnProps {
	children: React.ReactNode;
	OnClickHandler?: Function;
}

/**
 * ボタンを表示するコンポーネント
 */
export const ButtonComponent: React.SFC<OwnProps> = (props: OwnProps) => {
	return (
		<button
			className={ButtonStyle.button}
			onClick={event =>
				props.OnClickHandler ? props.OnClickHandler(event) : null
			}
		>
			{props.children}
		</button>
	);
};
