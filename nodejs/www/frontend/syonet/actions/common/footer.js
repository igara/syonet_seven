// @flow

import type { StoresType } from '../../stores'

/**
 * フッダーのアクション
 */
export default class FooterAction {
	Stores: StoresType

	/**
	 * @constructor
	 */
	constructor(Stores: StoresType) {
		this.Stores = Stores
	}

	/**
	 * LinkIconを押下したときの処理
	 */
	onClickLinkIcon() {
		this.Stores.SidebarStore.SidebarDispFlag(true)
	}
}
