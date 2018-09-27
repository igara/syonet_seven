/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'
import { HeaderStyle, IconStyle } from '../../statics/styles'
import syonetSvg from '../../images/syonet.svg'

import type { StoresType } from '../../stores'

export type HeaderComponentVnode = {
	attrs: {
		Stores: StoresType,
	},
}

/**
 * ヘッダーを表示するコンポーネント
 */
export default class HeaderComponent {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: HeaderComponentVnode) {
		this.Stores = vnode.attrs.Stores
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<ul class={HeaderStyle.header_wrap_ul}>
				<li>{m.trust(syonetSvg)}</li>
				<li>
					{this.Stores.LoginStore.User() ? (
						<img
							class={IconStyle.Icon.login_user_icon}
							src={this.Stores.LoginStore.User().image}
						/>
					) : null}
				</li>
			</ul>
		)
	}
}
