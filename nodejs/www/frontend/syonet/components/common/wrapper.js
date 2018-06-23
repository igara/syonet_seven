/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'
import HeaderComponent from './header'
import FooterComponent from './footer'
import SidebarComponent from './sidebar'
import { ContentStyle } from '../../statics/styles'

import Cookies from '../../statics/js_cookie'
import { callLoginCheck } from '../../fetchs/login'

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

	async checkAuth() {
		// ログインチェック
		const sessionId = Cookies.get('connect.sid')
		if (sessionId) {
			const json = await callLoginCheck()
			this.Stores.LoginStore.Status(json.status)
			if (json.status === 200) {
				this.Stores.LoginStore.User(json.user)
			}
		}
		const user = this.Stores.LoginStore.User()
		if (
			this.Auth &&
			(typeof user === 'undefined' || user === null || user === '')
		) {
			m.route.set('/login')
		}
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode
	 */
	async oninit(vnode: WrapperComponentVnode) {
		this.Stores.HeaderStore.HeaderTitle(this.HeaderTitle)
		await this.checkAuth()
		m.redraw()
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<HeaderComponent Stores={this.Stores} />
				{this.Stores.SidebarStore.SidebarDispFlag() ? (
					<SidebarComponent Stores={this.Stores} />
				) : null}
				<div className={ContentStyle.content_wrap_div}>
					<this.ChildComponent Stores={this.Stores} />
				</div>
				<FooterComponent Stores={this.Stores} />
			</div>
		)
	}
}
