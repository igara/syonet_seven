import { m } from '../../statics/mithril'
import { ButtonStyle } from '../../statics/styles'

/**
 * ボタンを表示するコンポーネント
 */
export default class ButtonComponent {
	/**
	 * propsで渡されてきた押下時のイベントハンドラ
	 */
	OnClickHandler

	Href

	Children

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode) {
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
				onclick={() => (this.OnClickHandler ? this.OnClickHandler() : null)}
			>
				{this.Href ? (
					<a href={this.Href}>{this.Children}</a>
				) : (
					<a>{this.Children}</a>
				)}
			</button>
		)
	}
}
