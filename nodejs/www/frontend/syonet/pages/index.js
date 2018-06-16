/**
 * @flow
 * @jsx m
 */

import { m } from '../statics/mithril'

/**
 * Routing URL: //index/
 */
export default class IndexPage {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: IndexPageVnode) {
		this.Stores = vnode.attrs.Stores
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return <div />
	}
}
