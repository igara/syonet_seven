/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'
import Button from '../../components/common/input/button'
import Text from '../../components/common/input/text'
import File from '../../components/common/input/file'
import AnalyzeImageAction from '../../actions/tensorflowjs/analyze_image'
import { AnalyzeImageStyle, TextStyle } from '../../statics/styles'
import closeSvg from '../../images/close.svg'

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

	categorys: Array<{
		id: number,
		name: string,
		images: Array<{
			imageUrl: string,
			imageRGB: Array<Array<Array<number>>>,
		}>,
	}>

	selectedCategoryID: number

	selectedCategory: {
		id: number,
		name: string,
		images: Array<{
			imageUrl: string,
			imageRGB: Array<Array<Array<number>>>,
		}>,
	}

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
		this.categorys = this.Stores.KerasAnalyzeImageStore.Category()
		this.selectedCategoryID = this.Stores.KerasAnalyzeImageStore.SelectedCategoryID()
		const selectedCategory = this.categorys.find(
			category => category.id === this.selectedCategoryID,
		)
		this.selectedCategory = {
			id: 0,
			name: '無題0',
			images: [],
		}
		if (
			typeof selectedCategory !== 'undefined' &&
			selectedCategory !== null &&
			typeof selectedCategory.id !== 'undefined' &&
			selectedCategory.id !== null &&
			typeof selectedCategory.name !== 'undefined' &&
			selectedCategory.name !== null &&
			typeof selectedCategory.images !== 'undefined' &&
			selectedCategory.images !== null
		) {
			this.selectedCategory = selectedCategory
		} else {
			this.Stores.KerasAnalyzeImageStore.Category([this.selectedCategory])
		}
		return (
			<div>
				<div>
					<Text
						OnInputHandler={this.AnalyzeImageAction.onInputModelName}
						Placeholder="モデル名"
					/>
					<Button
						OnClickHandler={() => this.AnalyzeImageAction.onClickSaveModel()}
					>
						モデルの保存
					</Button>
					<Button
						Stores={this.Stores}
						OnClickHandler={() => this.AnalyzeImageAction.onClickAddCategory()}
					>
						カテゴリの追加
					</Button>
				</div>
				<ul class={AnalyzeImageStyle.name_area_list}>
					{this.categorys.map(category => (
						<li
							key={category.id}
							onclick={() =>
								this.AnalyzeImageAction.onClickCategoryName(category.id)
							}
						>
							{category.name}
						</li>
					))}
				</ul>
				<div key={this.selectedCategory.id}>
					<input
						type="text"
						class={TextStyle.text}
						oninput={(event: SyntheticInputEvent<HTMLInputElement>) =>
							this.AnalyzeImageAction.onInputCategoryName(
								event,
								this.selectedCategory.id,
							)
						}
						placeholder="カテゴリ名"
						value={this.selectedCategory.name}
					/>
					<File
						Stores={this.Stores}
						OnInputHandler={(event: SyntheticInputEvent<HTMLInputElement>) =>
							this.AnalyzeImageAction.onInputCategoryFile(
								event,
								this.selectedCategory.id,
								m,
							)
						}
						Multiple={true}
						Key={`analyze_image_${this.selectedCategory.id}`}
						Accept="image/*"
					/>
					<ul class={AnalyzeImageStyle.image_area_list}>
						{this.selectedCategory.images.map((image, index) => (
							<li key={this.selectedCategory.id}>
								<img
									key={`analyze_image_${this.selectedCategory.id}`}
									src={image.imageUrl}
									class={AnalyzeImageStyle.image}
								/>
								<i
									class={AnalyzeImageStyle.close_icon}
									onclick={() =>
										this.AnalyzeImageAction.onClickRemoveImage(
											this.selectedCategory.id,
											index,
										)
									}
								>
									{m.trust(closeSvg)}
								</i>
							</li>
						))}
					</ul>
				</div>
			</div>
		)
	}
}
