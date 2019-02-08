import * as React from 'react'
import { TermStyle } from '@F_syonet/styles'
import { sleep } from '@www/libs/sleep'
import { ButtonComponent as Button } from '@F_syonet/components/common/input/button'
import { AppState } from '@F_syonet/stores/index'
import { RoutesActions } from '@F_syonet/containers/routes'

interface OwnProps {}

type TermProps = OwnProps & AppState & RoutesActions

/**
 * 利用規約を表示するコンポーネント
 */
export const TermComponent: React.SFC<TermProps> = (props: TermProps) => {
	return (
		<div
			className={`${TermStyle.term_wrap_div} ${
				props.Term.TermDispFlag ? '' : TermStyle.hidden
			}`}
		>
			<div className={TermStyle.term_overlay_div}>
				<div className={TermStyle.term_content}>
					<Button OnClickHandler={props.Actions.term.onClickClose}>
						閉じる
					</Button>
					<div>利用規約</div>
					<div>利用上の留意事項</div>
					<ul>
						<li>状態保持の機構としてCookiesを使用しております。</li>
						<li>
							本サイトのログイン機能としてSNSを使用した認証を行なっています。
							その際、SNSのアカウントに紐づいた情報を取得させていただきますので同意の元、ご利用をよろしくお願い致します。
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
