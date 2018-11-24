/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'

import type { StoresType } from '@F_syonet/stores'

export type NotFoundPageVnode = {
	attrs: {
		Stores: StoresType,
	},
}

/**
 * Routing URL: //:any
 */
export default class NotFoundPage {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

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
		return <div>存在しないページです</div>
	}
}
