import {m} from '../vendor'
import LoginCheckStore from '../stores/login_check_store'
import LoginCheckAction from '../actions/login_check_action'

/**
 * Routing URL: //login/check/:token
 */
export default class LoginCheckComponent {

	/**
	 * @type {HeaderStore} HeaderStore
	 */
	HeaderStore

	/**
	 * @type {SidebarStore} SidebarStore
	 */
	SidebarStore

	/**
	 * @type {LoginCheckStore} LoginCheckStore
	 */
	LoginCheckStore

	/**
	 * @type {LoginCheckAction} LoginCheckAction
	 */
	LoginCheckAction

	/**
	 * @type {String} token
	 */
	token

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode) {
		this.HeaderStore = vnode.attrs.HeaderStore
		this.SidebarStore = vnode.attrs.SidebarStore
		this.LoginCheckStore = LoginCheckStore
		this.LoginCheckAction = new LoginCheckAction(LoginCheckStore)
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode
	 */
	oninit(vnode) {
		this.SidebarStore.sidebar_disp_flag(false)
		this.LoginCheckAction.setToken(m.route.param('token'))
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				{(() => {
					if (this.LoginCheckStore.status() === '') {
						return <div>読み込み中</div>
					} else if (this.LoginCheckStore.status() === 200) {
						return <div>読み込みました</div>
					} else if (this.LoginCheckStore.status() !== 200) {
						return <div>読み込みできませんでした</div>
					}
				})()}
			</div>
		)
	}

	/**
	 * Lifecycle: The oncreate hook is called after a DOM element is created and attached to the document.
	 * @param {Vnode<A, this>} vnode
	 */
	async oncreate(vnode) {
		await this.LoginCheckAction.callLoginCheckApi()
		m.redraw()
	}
}
