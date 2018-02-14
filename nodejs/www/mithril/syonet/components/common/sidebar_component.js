import {m} from '../../vendor'
import sidebar_style from '../../styles/common/sidebar.scss'
import SidebarAction from '../../actions/common/sidebar_action'

/**
 * サイドバーを表示するコンポーネント
 */
export default class SidebarComponent {

	/**
	 * @type {SidebarStore} SidebarStore
	 */
	SidebarStore

	/**
	 * @type {SidebarAction} SidebarAction
	 */
	SidebarAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.SidebarStore = vnode.attrs.SidebarStore
		this.SidebarAction = new SidebarAction(this.SidebarStore)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<div class={sidebar_style.sidebar_wrap_div} />
				<div class={sidebar_style.sidebar_link_wrap_div}>
					<a onclick={() => this.SidebarAction.onClickClose()}>閉じる</a>
				</div>
				<button
					class={sidebar_style.sidebar_close_button}
					onclick={() => this.SidebarAction.onClickClose()}>
					<div class={sidebar_style.sidebar_close} />
				</button>
			</div>
		)
	}
}
