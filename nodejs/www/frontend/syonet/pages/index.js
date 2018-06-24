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
		return (
			<div>
				なんとなくdiscordはじめてみました。ChatOps的な何かとかやってます。ご自由にご参加ください。
				<iframe
					src="https://discordapp.com/widget?id=426647501643317252&theme=light&username=anonimas"
					width="100%"
					height="300"
					allowTransparency="true"
					frameBorder="0"
				/>
			</div>
		)
	}
}
