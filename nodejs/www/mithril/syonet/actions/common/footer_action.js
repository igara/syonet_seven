/**
 * フッダーのアクション
 */
export default class FooterAction {

	/**
	 * @constructor
	 */
	constructor(SidebarStore) {
		this.SidebarStore = SidebarStore
	}

	/**
	 * HomeIconを押下したときの処理
	 */
	onClickHomeIcon() {
	}

	/**
	 * LinkIconを押下したときの処理
	 */
	onClickLinkIcon() {
		this.SidebarStore.sidebar_disp_flag(true)
	}
}
