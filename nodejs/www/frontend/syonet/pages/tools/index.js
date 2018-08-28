/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'

/**
 * Routing URL: //tools/
 */
export default class ToolsPage {
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
				<ul>
					<li
						onclick={event => {
							event.preventDefault()
							m.route.set('/tools/analyze_image')
						}}
					>
						<a href="/tools/analyze_image">画像解析ツール</a>
					</li>
				</ul>
			</div>
		)
	}
}
