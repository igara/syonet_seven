/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'
import { HeaderStyle, IconStyle } from '../../statics/styles'
import syonetSvg from '../../images/syonet.svg'

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
