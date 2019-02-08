import * as React from 'react'
import { Link } from 'react-router-dom'
import { SidebarStyle, IconStyle } from '@F_syonet/styles'
import { sleep } from '@www/libs/sleep'
import { AppState } from '@F_syonet/stores/index'
import { RoutesActions } from '@F_syonet/containers/routes'

interface OwnProps {}

type SidebarProps = OwnProps & AppState & RoutesActions

/**
 * サイドバーを表示するコンポーネント
 */
export const SidebarComponent: React.SFC<SidebarProps> = (
	props: SidebarProps,
) => {
	return (
		<div
			className={`${SidebarStyle.sidebar_wrap_div} ${
				props.Sidebar.SidebarDispFlag ? '' : SidebarStyle.hidden
			}`}
		>
			<div className={SidebarStyle.sidebar_overlay_div} />
			<ul className={SidebarStyle.sidebar_link_wrap_ul}>
				<li
					className={SidebarStyle.sidebar_link_list}
					onClick={props.Actions.sidebar.onClickClose}
				>
					閉じる
				</li>
				<li
					className={SidebarStyle.sidebar_link_list}
					onClick={props.Actions.sidebar.onClickHome}
				>
					<Link to="/">ホーム</Link>
				</li>
				{props.Login.login.data.user ? (
					<li
						className={SidebarStyle.sidebar_link_list}
						onClick={props.Actions.sidebar.onClickLogout}
					>
						<a>ログアウト</a>
					</li>
				) : (
					<li
						className={SidebarStyle.sidebar_link_list}
						onClick={props.Actions.sidebar.onClickLogin}
					>
						<Link to="/login">ログイン</Link>
					</li>
				)}
				<li
					className={SidebarStyle.sidebar_link_list}
					onClick={props.Actions.sidebar.onClickTools}
				>
					<Link to="/tools">ツール</Link>
				</li>
				<li
					className={SidebarStyle.sidebar_link_list}
					onClick={props.Actions.sidebar.onClickTerm}
				>
					利用規約
				</li>
				<li className={SidebarStyle.sidebar_link_list}>
					<a
						href="https://github.com/igara/syonet_seven"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
				</li>
				<li
					className={SidebarStyle.sidebar_link_list}
					// onClick={() => this.SidebarAction.onClickCacheClear()}
				>
					<a>キャッシュクリア</a>
				</li>
			</ul>
			<button
				className={IconStyle.Close.close_icon}
				onClick={props.Actions.sidebar.onClickClose}
			>
				<div className={IconStyle.Close.close_mark} />
			</button>
		</div>
	)
}
