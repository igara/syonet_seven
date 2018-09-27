/**
 * @flow
 * @jsx m
 */

import { m } from '../../../statics/mithril'
import { ButtonStyle } from '../../../statics/styles'

import type { StoresType } from '../../../stores'

export type ButtonComponentVnode = {
	attrs: {
		Stores: StoresType,
		OnClickHandler: Function,
		Href: string,
	},
	children: React.Node,
}

/**
 * ボタンを表示するコンポーネント
 */
export default class ButtonComponent {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * propsで渡されてきた押下時のイベントハンドラ
	 * @type {Function} OnClickHandler
	 */
	OnClickHandler: Function

	/**
	 * リンクURL
	 * @type {String} Href
	 */
	Href: string

	/**
	 * @type {HTMLElement} Children
	 */
	Children: HTMLElement

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: ButtonComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.OnClickHandler = vnode.attrs.OnClickHandler
		this.Href = vnode.attrs.Href
		this.Children = vnode.children.find(c => c.children)
	}

	oninit(vnode: ButtonComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.OnClickHandler = vnode.attrs.OnClickHandler
		this.Href = vnode.attrs.Href
		this.Children = vnode.children.find(c => c.children)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<button
				class={ButtonStyle.button}
				onclick={(event: SyntheticInputEvent<HTMLInputElement>) =>
					this.OnClickHandler ? this.OnClickHandler(event) : null
				}
			>
				{this.Href ? (
					<a href={this.Href}>{this.Children}</a>
				) : (
					<span>{this.Children}</span>
				)}
			</button>
		)
	}
}
