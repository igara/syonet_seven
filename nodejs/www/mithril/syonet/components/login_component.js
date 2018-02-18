import {m} from '../vendor'

/**
 * Routing URL: //login/
 */
export default class LoginComponent {

	/**
	 * @type {HeaderStore} HeaderStore
	 */
	HeaderStore

	/**
	 * @type {SidebarStore} SidebarStore
	 */
	SidebarStore

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode) {
		this.HeaderStore = vnode.attrs.HeaderStore
		this.SidebarStore = vnode.attrs.SidebarStore
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode 
	 */
	oninit(vnode) {
		this.SidebarStore.sidebar_disp_flag(false)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				ログイン画面です
				<a href="http://127.0.0.1:3000/auth/google">Google</a>
			</div>
		)
	}
}
