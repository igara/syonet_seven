/**
 * サイドバーのアクション
 */
export default class SidebarAction {

	/**
	 * @type {SidebarStore} SidebarStore
	 */
	SidebarStore

	/**
	 * @constructor
	 */
	constructor(SidebarStore) {
		this.SidebarStore = SidebarStore
	}

	/**
	 * 閉じるを押下したときの処理
	 */
	onClickClose() {
		this.SidebarStore.sidebar_disp_flag_stream(false)
	}
}
