/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'
import AnalyzeImageListAction from '../../actions/analyze_image/list'

/**
 * Routing URL: //analyze_image/
 */
export default class AnalyzeImageListPage {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @type {AnalyzeImageListAction} AnalyzeImageListAction
	 */
	AnalyzeImageListAction: AnalyzeImageListAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: AnalyzeImageListPageVnode) {
		this.Stores = vnode.attrs.Stores
		this.AnalyzeImageListAction = new AnalyzeImageListAction(this.Stores)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		const lists = this.Stores.AnalyzeImageListStore.List()
		return (
			<div>
				{typeof lists === 'undefined' || lists === null ? (
					<div>読み込み中です</div>
				) : (
					<ul>
						{this.Stores.AnalyzeImageListStore.List().map(list => (
							<li
								key={list.sha}
								onclick={event =>
									this.AnalyzeImageListAction.onClickAnalyzeImage(
										m,
										event,
										list.sha,
									)
								}
							>
								<a href={`/analyze_image/load/${list.sha}`}>{list.name}</a>
							</li>
						))}
					</ul>
				)}
			</div>
		)
	}
}
