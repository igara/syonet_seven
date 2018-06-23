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
}
