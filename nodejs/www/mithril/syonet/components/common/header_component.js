import {m} from '../../vendor'
import header_style from '../../styles/common/header.scss'

/**
 * ヘッダーを表示するコンポーネント
 */
export default class HeaderComponent {

	/**
	 * @type {HeaderStore} HeaderStore
	 */
	HeaderStore

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.HeaderStore = vnode.attrs.HeaderStore
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={header_style.header_wrap_div}>
				{this.HeaderStore.header_title_stream}
			</div>
		)
	}
}
