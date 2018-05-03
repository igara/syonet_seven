import {m} from '../../mithril'
import {SidebarStyle, IconStyle} from '../../styles'
import SidebarAction from '../../actions/common/sidebar_action'
import sleep from '../../../../libs/sleep'

/**
 * サイドバーを表示するコンポーネント
 */
export default class SidebarComponent {

	/**
	 * @type {SidebarAction} SidebarAction
	 */
	SidebarAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
		this.SidebarAction = new SidebarAction(this.Stores)
	}

	/**
	 * Lifecycle: The onbeforeupdate hook is called before a vnode is diffed in a update.
	 * @param {Vnode<A, this>} vnode 
	 */
	async onbeforeremove(vnode) {
		vnode.dom.classList.add(SidebarStyle.sidebar_exit)
		return await sleep(1000)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={SidebarStyle.sidebar_wrap_div}>
				<div class={SidebarStyle.sidebar_overlay_div} />
				<ul class={SidebarStyle.sidebar_link_wrap_ul}>
					<li class={SidebarStyle.sidebar_link_list}
						onclick={() => this.SidebarAction.onClickClose()}>
						閉じる
					</li>
					<li class={SidebarStyle.sidebar_link_list}
						onclick={() => this.SidebarAction.onClickHome(m)}>
						ホーム
					</li>
					{this.Stores.LoginStore.user() ?
						<li class={SidebarStyle.sidebar_link_list}
							onclick={() => this.SidebarAction.onClickLogout(m)}>
							ログアウト
						</li> :
						<li class={SidebarStyle.sidebar_link_list}
							onclick={() => this.SidebarAction.onClickLogin(m)}>
							ログイン
						</li>
					}
					<li class={SidebarStyle.sidebar_link_list}>
						利用規約
					</li>
					<li class={SidebarStyle.sidebar_link_list}>
						ライセンス
					</li>
				</ul>
				<button
					class={IconStyle.Close.close_icon}
					onclick={() => this.SidebarAction.onClickClose()}>
					<div class={IconStyle.Close.close_mark} />
				</button>
			</div>
		)
	}
}
