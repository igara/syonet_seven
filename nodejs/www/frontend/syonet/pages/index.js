/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'

import type { StoresType } from '@F_syonet/stores'

export type IndexPageVnode = {
	attrs: {
		Stores: StoresType,
	},
}

/**
 * Routing URL: //index/
 */
export default class IndexPage {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

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
				またこのページはオフラインでも見れます。たまに左下の三表示からキャッシュを削除してご利用ください。
			</div>
		)
	}
}
