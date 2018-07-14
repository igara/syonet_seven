/**
 * @flow
 * @jsx m
 */

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
	 * @type {Function} OnInputHandler
	 */
	OnInputHandler: Function

	/**
	 * @type {String} Placeholder
	 */
	Placeholder: string

	/**
	 * @type {String} DefalutValue
	 */
	DefalutValue: string

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: TextComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.OnInputHandler = vnode.attrs.OnInputHandler
		this.Placeholder = vnode.attrs.Placeholder
		this.DefalutValue = vnode.attrs.DefalutValue
	}

	oninit(vnode: TextComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.OnInputHandler = vnode.attrs.OnInputHandler
		this.Placeholder = vnode.attrs.Placeholder
		this.DefalutValue = vnode.attrs.DefalutValue
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<input
				type="text"
				class={TextStyle.text}
				oninput={this.OnInputHandler}
				placeholder={this.Placeholder}
				value={this.DefalutValue}
			/>
		)
	}
}
