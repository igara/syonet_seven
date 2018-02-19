import {m} from '../mithril'

/**
 * Routing URL: //index/
 */
export default class IndexComponent {

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
