// @flow

/**
 * フッダーのアクション
 */
export default class FooterAction {
	Stores: Stores

	/**
	 * @constructor
	 */
	constructor(Stores: Stores) {
		this.Stores = Stores
	}

	/**
	 * HomeIconを押下したときの処理
	 */
	onClickHomeIcon() {}

	/**
	 * LinkIconを押下したときの処理
	 */
	onClickLinkIcon() {
		this.Stores.SidebarStore.SidebarDispFlag(true)
	}
}
