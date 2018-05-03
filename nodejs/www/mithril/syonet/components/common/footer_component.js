import {m} from '../../mithril'
import FooterAction from '../../actions/common/footer_action'
import {footer, icon} from '../../styles'

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
			<div class={footer.footer_wrap_div}>
				<button
					class={icon.hamburger.hamburger_icon}
					onclick={() => this.FooterAction.onClickLinkIcon()}>
					<div class={icon.hamburger.hamburger_mark_top} />
					<div class={icon.hamburger.hamburger_mark} />
					<div class={icon.hamburger.hamburger_mark_bottom} />
				</button>
			</div>
		)
	}
}
