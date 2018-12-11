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
 * Routing URL: //tools/
 */
export default class ToolsPage {
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
				<ul>
					<li
						onclick={event => {
							event.preventDefault()
							m.route.set('/tools/analyze_image')
						}}
					>
						<a href="/tools/analyze_image">画像解析ツール</a>
					</li>
					<li
						onclick={event => {
							event.preventDefault()
							m.route.set('/tools/voting')
						}}
					>
						<a href="/tools/voting">投票ツール</a>
					</li>
				</ul>
			</div>
		)
	}
}
