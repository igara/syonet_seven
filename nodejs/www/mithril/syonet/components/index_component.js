import {m} from '../vendor'

/**
 * Routing URL: //index/
 */
export default class IndexComponent {

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
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
			</div>
		)
	}
}
