import {m} from '../mithril'

/**
 * Routing URL: //login/
 */
export default class LoginComponent {

	/**
	 * @type {Stores} Stores
	 */
	Stores

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
		this.Stores.SidebarStore.sidebar_disp_flag(false)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				ログイン画面です
				<a href="http://127.0.0.1:3000/auth/google">Google</a>
				<a href="http://127.0.0.1:3000/auth/facebook">facebook</a>
				<a href="http://127.0.0.1:3000/auth/twitter">twitter</a>
				<a href="http://127.0.0.1:3000/auth/github">github</a>
			</div>
		)
	}
}
