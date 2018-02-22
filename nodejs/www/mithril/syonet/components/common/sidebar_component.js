import {m} from '../../mithril'
import {sidebar_style, icon_style} from '../../styles'
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
		vnode.dom.classList.add(sidebar_style.sidebar_exit)
		return await sleep(1000)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={sidebar_style.sidebar_wrap_div}>
				<div class={sidebar_style.sidebar_overlay_div} />
				<ul class={sidebar_style.sidebar_link_wrap_ul}>
					<li class={sidebar_style.sidebar_link_list}
						onclick={() => this.SidebarAction.onClickClose()}>
						閉じる
					</li>
					<li class={sidebar_style.sidebar_link_list}
						onclick={() => this.SidebarAction.onClickHome(m)}>
						ホーム
					</li>
					{this.Stores.LoginStore.user() ?
						<li class={sidebar_style.sidebar_link_list}
							onclick={() => this.SidebarAction.onClickLogout(m)}>
							ログアウト
						</li> :
						<li class={sidebar_style.sidebar_link_list}
							onclick={() => this.SidebarAction.onClickLogin(m)}>
							ログイン
						</li>
					}
				</ul>
				<button
					class={icon_style.sidebar_close_icon}
					onclick={() => this.SidebarAction.onClickClose()}>
					<div class={icon_style.sidebar_close_mark} />
				</button>
			</div>
		)
	}
}
