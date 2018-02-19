import {m} from '../vendor'
import LoginCheckAction from '../actions/login_check_action'

/**
 * Routing URL: //login/check/:token
 */
export default class LoginCheckComponent {

	/**
	 * @type {Stores} Stores
	 */
	Stores

	/**
	 * @type {LoginCheckAction} LoginCheckAction
	 */
	LoginCheckAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
		this.LoginCheckAction = new LoginCheckAction(this.Stores.LoginStore)
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode
	 */
	oninit(vnode) {
		this.Stores.SidebarStore.sidebar_disp_flag(false)
		this.LoginCheckAction.setToken(m.route.param('token'))
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				{(() => {
					if (this.Stores.LoginStore.status() === '') {
						return <div>読み込み中</div>
					} else if (this.Stores.LoginStore.status() === 200) {
						return <div>読み込みました</div>
					} else if (this.Stores.LoginStore.status() !== 200) {
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
