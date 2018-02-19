import {m} from '../../mithril'
import header_style from '../../styles/common/header.scss'

/**
 * ヘッダーを表示するコンポーネント
 */
export default class HeaderComponent {

	/**
	 * @type {Stores} Stores
	 */
	Stores

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={header_style.header_wrap_div}>
				{this.Stores.HeaderStore.header_title}
			</div>
		)
	}
}
