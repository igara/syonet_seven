import sleep from '../../../../libs/sleep'

/**
 * 利用規約のアクション
 */
export default class TermAction {

	/**
	 * @type {Stores} Stores
	 */
	Stores

	/**
	 * @constructor
	 */
	constructor(Stores) {
		this.Stores = Stores
	}

	/**
	 * 閉じるを押下したときの処理
	 */
	onClickClose() {
		this.Stores.TermStore.TermDispFlag(false)
	}
}
