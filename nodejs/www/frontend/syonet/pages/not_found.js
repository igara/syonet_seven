/**
 * @flow
 * @jsx m
 */

import {m} from '../mithril'

/**
 * Routing URL: //:any
 */
export default class NotFoundPage {

	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode 
	 */
	constructor(vnode: NotFoundPageVnode) {
		this.Stores = vnode.attrs.Stores
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				存在しないページです
			</div>
		)
	}
}
