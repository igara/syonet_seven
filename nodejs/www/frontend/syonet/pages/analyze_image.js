import { m } from '../statics/mithril'
import Button from '../components/common/button'
import AnalyzeImageAction from '../actions/analyze_image'

/**
 * Routing URL: //analyzeimage/
 */
export default class AnalyzeImagePage {
	/**
	 * @type {Stores} Stores
	 */
	Stores

	/**
	 * @type {AnalyzeImageAction} AnalyzeImageAction
	 */
	AnalyzeImageAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode) {
		this.Stores = vnode.attrs.Stores
		this.AnalyzeImageAction = new AnalyzeImageAction(this.Stores)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<Button>カテゴリの追加</Button>
				<Button onclick={() => this.AnalyzeImageAction.onClickSaveModel()}>
					モデルの保存
				</Button>
			</div>
		)
	}
}
