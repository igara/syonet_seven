import { m } from '../../../statics/mithril'
import { TextStyle } from '../../../statics/styles'

/**
 * 入力フォームを表示するコンポーネント
 */
export default class TextComponent {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * propsで渡されてきた入力フォームの変更時のイベントハンドラ
	 * @type {Function} OnChangeHandler
	 */
	OnChangeHandler: Function

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: TextComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.OnChangeHandler = vnode.attrs.OnChangeHandler
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<input
				type="text"
				class={TextStyle.text}
				onChange={this.OnChangeHandler}
			/>
		)
	}
}
