/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import { TextStyle } from '@F_syonet/statics/styles'

import type { StoresType } from '@F_syonet/stores'

export type TextComponentVnode = {
	attrs: {
		Stores: StoresType,
		OnInputHandler: Function,
		Placeholder: string,
		DefalutValue: string,
	},
}

/**
 * 入力フォームを表示するコンポーネント
 */
export default class TextComponent {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

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

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<input
				type="text"
				class={TextStyle.text}
				oninput={(event: SyntheticInputEvent<HTMLInputElement>) =>
					this.OnInputHandler(event)
				}
				placeholder={this.Placeholder}
				value={this.DefalutValue}
			/>
		)
	}
}
