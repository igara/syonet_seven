import * as React from "react";
import { SelectStyle } from "@F_syonet/styles";

interface OwnProps {
	children: Array<React.ReactNode>;
	OnChangeHandler?: Function;
}

export const SelectComponent: React.SFC<OwnProps> = (props: OwnProps) => {
	return (
		<select
			className={SelectStyle.select}
			onChange={props.OnChangeHandler ? props.OnChangeHandler(event) : null}
		>
			{props.children}
		</select>
	);
};
