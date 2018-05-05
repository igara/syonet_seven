import {m} from '../mithril'
import {getApiHost} from '../../../libs/api'

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
		this.Stores.SidebarStore.SidebarDispFlag(false)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		const host = getApiHost()
		return (
			<div>
				ログイン画面です
				<a href={`${host}/auth/google`}>Google</a>
				<a href={`${host}/auth/facebook`}>facebook</a>
				<a href={`${host}/auth/auth/twitter`}>twitter</a>
				<a href={`${host}/auth/github`}>github</a>
			</div>
		)
	}
}
