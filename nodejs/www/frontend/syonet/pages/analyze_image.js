/**
 * @flow
 * @jsx m
 */

import { m } from '../statics/mithril'
import Button from '../components/common/input/button'
import Text from '../components/common/input/text'
import AnalyzeImageAction from '../actions/analyze_image'

/**
 * Routing URL: //analyzeimage/
 */
export default class AnalyzeImagePage {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @type {AnalyzeImageAction} AnalyzeImageAction
	 */
	AnalyzeImageAction: AnalyzeImageAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: AnalyzeImagePageVnode) {
		this.Stores = vnode.attrs.Stores
		this.AnalyzeImageAction = new AnalyzeImageAction(this.Stores)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				<Text
					OnInputHandler={this.AnalyzeImageAction.onInputModelName}
					Placeholder="モデル名"
				/>
				<Button OnClickHandler={this.AnalyzeImageAction.onClickSaveModel}>
					モデルの保存
				</Button>
				<Button
					Stores={this.Stores}
					OnClickHandler={this.AnalyzeImageAction.onClickAddCategory}
				>
					カテゴリの追加
				</Button>
				{this.Stores.AnalyzeImageStore.Category().map(category => (
					<div key={category.id}>
						<div>ID: {category.id}</div>
						<Text
							Stores={this.Stores}
							OnInputHandler={(event: SyntheticInputEvent<HTMLInputElement>) =>
								this.AnalyzeImageAction.onInputCategoryName(event, category.id)
							}
							Placeholder="カテゴリ名"
							DefalutValue={category.name}
						/>
					</div>
				))}
			</div>
		)
	}
}
