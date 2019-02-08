import * as React from 'react'
import { FooterStyle, IconStyle } from '@F_syonet/styles'
import { AppState } from '@F_syonet/stores/index'
import { RoutesActions } from '@F_syonet/containers/routes'

interface OwnProps {}

type FooterProps = OwnProps & AppState & RoutesActions

/**
 * フッダーを表示するコンポーネント
 */
export const FooterComponent: React.SFC<FooterProps> = (props: FooterProps) => {
	return (
		<div className={FooterStyle.footer_wrap_div}>
			<button
				className={IconStyle.Hamburger.hamburger_icon}
				onClick={props.Actions.footer.onClickLinkIcon}
			>
				<div className={IconStyle.Hamburger.hamburger_mark_top} />
				<div className={IconStyle.Hamburger.hamburger_mark} />
				<div className={IconStyle.Hamburger.hamburger_mark_bottom} />
			</button>
		</div>
	)
}
