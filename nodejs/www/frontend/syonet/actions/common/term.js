// @flow

import type { StoresType } from '@F_syonet/stores'

/**
 * 利用規約のアクション
 */
export default class TermAction {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @constructor
	 */
	constructor(Stores: StoresType) {
		this.Stores = Stores
	}

	/**
	 * 閉じるを押下したときの処理
	 */
	onClickClose() {
		this.Stores.TermStore.TermDispFlag(false)
	}
}
