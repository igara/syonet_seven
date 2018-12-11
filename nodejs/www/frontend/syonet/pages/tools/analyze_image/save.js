/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import Button from '@F_syonet/components/common/input/button'
import Text from '@F_syonet/components/common/input/text'
import File from '@F_syonet/components/common/input/file'
import AnalyzeImageSaveAction from '@F_syonet/actions/tools/analyze_image/save'
import { AnalyzeImageSaveStyle, TextStyle } from '@F_syonet/statics/styles'
import closeSvg from '@F_syonet/images/close.svg'

import type { StoresType } from '@F_syonet/stores'

export type AnalyzeImageSavePageVnode = {
	attrs: {
		Stores: StoresType,
	},
}

/**
 * Routing URL: //tools/analyze_image/save
 */
export default class AnalyzeImageSavePage {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @type {AnalyzeImageSaveAction} AnalyzeImageSaveAction
	 */
	AnalyzeImageSaveAction: AnalyzeImageSaveAction

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
	constructor(vnode: AnalyzeImageSavePageVnode) {
		this.Stores = vnode.attrs.Stores
		this.AnalyzeImageSaveAction = new AnalyzeImageSaveAction(this.Stores)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		this.categorys = this.Stores.AnalyzeImageSaveStore.Category()
		this.selectedCategoryID = this.Stores.AnalyzeImageSaveStore.SelectedCategoryID()
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
			this.Stores.AnalyzeImageSaveStore.Category([this.selectedCategory])
		}
		return (
			<div>
				<Button
					OnClickHandler={(event: SyntheticInputEvent<HTMLInputElement>) =>
						this.AnalyzeImageSaveAction.onClickList(m, event)
					}
					Href="/tools/analyze_image"
				>
					一覧へ戻る
				</Button>
				<div>
					<Text
						OnInputHandler={(event: SyntheticInputEvent<HTMLInputElement>) =>
							this.AnalyzeImageSaveAction.onInputModelName(event)
						}
						Placeholder="モデル名"
					/>
					<Button
						OnClickHandler={() =>
							this.AnalyzeImageSaveAction.onClickSaveModel()
						}
					>
						モデルの保存
					</Button>
					<Button
						Stores={this.Stores}
						OnClickHandler={() =>
							this.AnalyzeImageSaveAction.onClickAddCategory()
						}
					>
						カテゴリの追加
					</Button>
				</div>
				<ul class={AnalyzeImageSaveStyle.name_area_list}>
					{this.categorys.map(category => (
						<li
							key={category.id}
							onclick={() =>
								this.AnalyzeImageSaveAction.onClickCategoryName(category.id)
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
							this.AnalyzeImageSaveAction.onInputCategoryName(
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
							this.AnalyzeImageSaveAction.onInputCategoryFile(
								event,
								this.selectedCategory.id,
								m,
							)
						}
						Multiple={true}
						Key={`analyze_image_${this.selectedCategory.id}`}
						Accept="image/*"
					/>
					<ul class={AnalyzeImageSaveStyle.image_area_list}>
						{this.selectedCategory.images.map((image, index) => (
							<li key={this.selectedCategory.id}>
								<img
									key={`analyze_image_${this.selectedCategory.id}`}
									src={image.imageUrl}
									class={AnalyzeImageSaveStyle.image}
								/>
								<i
									class={AnalyzeImageSaveStyle.close_icon}
									onclick={() =>
										this.AnalyzeImageSaveAction.onClickRemoveImage(
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
