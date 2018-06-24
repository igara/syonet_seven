// @flow
import { analyser } from '../tensorflows/image'

/**
 * 画像認識画面のアクション
 */
export default class AnalyzeImageAction {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @constructor
	 */
	constructor(Stores: Stores) {
		this.Stores = Stores
	}

	/**
	 * モデル保存ボタンを押下したときの処理
	 */
	async onClickSaveModel() {
		await analyser()
	}

	/**
	 * モデル名を変更したときの処理
	 */
	async onInputModelName(event: SyntheticInputEvent<HTMLInputElement>) {
		console.log(event)
	}

	/**
	 * カテゴリ追加を押下したときの処理
	 */
	async onClickAddCategory() {
		const category = this.Stores.AnalyzeImageStore.Category().map(
			category => category,
		)
		category.push({
			id: category.length + 1,
			name: '',
		})
		this.Stores.AnalyzeImageStore.Category(category)
	}

	/**
	 * カテゴリ名を変更したときの処理
	 */
	async onInputCategoryName(
		event: SyntheticInputEvent<HTMLInputElement>,
		id: number,
	) {
		const name = event.target.value
		if (typeof name === 'undefined' || name === null || name === '') {
			return
		}
		const category = this.Stores.AnalyzeImageStore.Category().reduce(
			(accumulator, currentValue) => {
				if (id === currentValue.id) {
					accumulator.push({
						...currentValue,
						name,
					})
				} else {
					accumulator.push(currentValue)
				}
				return accumulator
			},
			[],
		)
		this.Stores.AnalyzeImageStore.Category(category)
	}
}
