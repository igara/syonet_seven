/**
 * @flow
 * @jsx m
 */

import { m } from '../statics/mithril'
import { getApiHost } from '../../../libs/api'
import Button from '../components/common/button'

/**
 * Routing URL: //login/
 */
export default class LoginPage {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: LoginPageVnode) {
		this.Stores = vnode.attrs.Stores
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode
	 */
	oninit(vnode: LoginPageVnode) {
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
				<Button Href={`${host}/auth/google`}>Google</Button>
				<Button Href={`${host}/auth/facebook`}>facebook</Button>
				<Button Href={`${host}/auth/twitter`}>twitter</Button>
				<Button Href={`${host}/auth/github`}>github</Button>
			</div>
		)
	}
}
