/**
 * @flow
 * @jsx m
 */

import {m} from '../../mithril'
import FooterAction from '../../actions/common/footer'
import {FooterStyle, IconStyle} from '../../styles'

/**
 * フッダーを表示するコンポーネント
 */
export default class FooterComponent {

	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @type {FooterAction} FooterAction
	 */
	FooterAction: FooterAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode: FooterComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.FooterAction = new FooterAction(this.Stores.SidebarStore)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={FooterStyle.footer_wrap_div}>
				<button
					class={IconStyle.Hamburger.hamburger_icon}
					onclick={() => this.FooterAction.onClickLinkIcon()}>
					<div class={IconStyle.Hamburger.hamburger_mark_top} />
					<div class={IconStyle.Hamburger.hamburger_mark} />
					<div class={IconStyle.Hamburger.hamburger_mark_bottom} />
				</button>
			</div>
		)
	}
}
