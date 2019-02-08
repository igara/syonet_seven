import * as React from "react";
import { HeaderStyle, IconStyle } from "@F_syonet/styles";
import * as syonetSvg from "@F_syonet/images/syonet.svg";
import { AppState } from "@F_syonet/stores/index";
import { RoutesActions } from "@F_syonet/containers/routes";

interface OwnProps {}

type HeaderProps = OwnProps & AppState & RoutesActions;

/**
 * ヘッダーを表示するコンポーネント
 */
export const HeaderComponent: React.SFC<HeaderProps> = (props: HeaderProps) => {
	return (
		<ul className={HeaderStyle.header_wrap_ul}>
			<li dangerouslySetInnerHTML={{ __html: syonetSvg }} />
			<li>
				{props.Login.login.data.user ? (
					<img
						className={IconStyle.Icon.login_user_icon}
						src={props.Login.login.data.user.image}
					/>
				) : null}
			</li>
		</ul>
	);
};
