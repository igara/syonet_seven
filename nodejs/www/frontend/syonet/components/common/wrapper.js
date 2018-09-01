/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'
import HeaderComponent from './header'
import FooterComponent from './footer'
import SidebarComponent from './sidebar'
import { ContentStyle } from '../../statics/styles'

/**
 * 共通のレイアウトを出力する
 */
export default class WrapperComponent {
	Stores: Stores

	/**
	 * @type {Mithril} ChildComponent
	 */
	ChildComponent: Object

	/**
	 * @type {String} HeaderTitle
	 */
	HeaderTitle: string

	/**
	 * @type {Boolean} Auth
	 */
	Auth: boolean

	VnodeAttrs: ?Object

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: WrapperComponentVnode) {
		this.Stores = vnode.Stores
		this.ChildComponent = vnode.ChildComponent
		this.HeaderTitle = vnode.HeaderTitle
		this.Auth = typeof vnode.Auth === 'boolean' ? vnode.Auth : false
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode
	 */
	async oninit(vnode: WrapperComponentVnode) {
		this.VnodeAttrs = vnode.attrs
		this.Stores.HeaderStore.HeaderTitle(this.HeaderTitle)
		const title = this.HeaderTitle ? `Syonet / ${this.HeaderTitle}` : 'Syonet'
		document.title = title
		const user = this.Stores.LoginStore.User()
		if (this.Auth && (typeof user === 'undefined' || user === null)) {
			m.route.set('/login')
		}
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<HeaderComponent {...this.VnodeAttrs} Stores={this.Stores} />
				{this.Stores.SidebarStore.SidebarDispFlag() ? (
					<SidebarComponent {...this.VnodeAttrs} Stores={this.Stores} />
				) : null}
				<div className={ContentStyle.content_wrap_div}>
					<this.ChildComponent {...this.VnodeAttrs} Stores={this.Stores} />
				</div>
				<FooterComponent {...this.VnodeAttrs} Stores={this.Stores} />
			</div>
		)
	}
}
