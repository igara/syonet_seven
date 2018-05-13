import {m} from '../../mithril'
import {ButtonStyle} from '../../styles'

/**
 * ボタンを表示するコンポーネント
 */
export default class TermComponent {

	Stores;

	/**
	 * propsで渡されてきた押下時のイベントハンドラ
	 */
	OnClickHandler

	Children

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
		this.OnClickHandler = vnode.attrs.OnClickHandler
		this.Children = vnode.children.find(c => c.children)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<button onclick={() => this.OnClickHandler()}>
				{this.Children}
			</button>
		)
	}
}
