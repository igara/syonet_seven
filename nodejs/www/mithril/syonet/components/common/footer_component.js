import {m} from '../../mithril'
import FooterAction from '../../actions/common/footer_action'
import {footer_style, icon_style} from '../../styles'

/**
 * フッダーを表示するコンポーネント
 */
export default class FooterComponent {

	/**
	 * @type {Stores} Stores
	 */
	Stores

	/**
	 * @type {FooterAction} FooterAction
	 */
	FooterAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
		this.FooterAction = new FooterAction(this.Stores.SidebarStore)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={footer_style.footer_wrap_div}>
				<button
					class={icon_style.sidebar_icon}
					onclick={() => this.FooterAction.onClickLinkIcon()}>
					<div class={icon_style.sidebar_mark_top} />
					<div class={icon_style.sidebar_mark} />
					<div class={icon_style.sidebar_mark_bottom} />
				</button>
			</div>
		)
	}
}
