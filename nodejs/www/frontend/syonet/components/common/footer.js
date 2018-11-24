/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import FooterAction from '@F_syonet/actions/common/footer'
import { FooterStyle, IconStyle } from '@F_syonet/statics/styles'

import type { StoresType } from '@F_syonet/stores'

export type FooterComponentVnode = {
	attrs: {
		Stores: StoresType,
	},
}

/**
 * フッダーを表示するコンポーネント
 */
export default class FooterComponent {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

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
		this.FooterAction = new FooterAction(this.Stores)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={FooterStyle.footer_wrap_div}>
				<button
					class={IconStyle.Hamburger.hamburger_icon}
					onclick={() => this.FooterAction.onClickLinkIcon()}
				>
					<div class={IconStyle.Hamburger.hamburger_mark_top} />
					<div class={IconStyle.Hamburger.hamburger_mark} />
					<div class={IconStyle.Hamburger.hamburger_mark_bottom} />
				</button>
			</div>
		)
	}
}
