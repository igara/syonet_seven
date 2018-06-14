/**
 * @flow
 * @jsx m
 */

import { m } from '../../mithril'
import { HeaderStyle, IconStyle } from '../../styles'

/**
 * ヘッダーを表示するコンポーネント
 */
export default class HeaderComponent {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

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
				<li>{this.Stores.HeaderStore.HeaderTitle}</li>
				<li>
					{this.Stores.LoginStore.User().image ? (
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
