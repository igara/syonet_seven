import sleep from '../../../../libs/sleep'

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
		this.SidebarStore.sidebar_disp_flag(false)
	}

	/**
	 * ログインを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickLogin(m) {
		const pathname = '/login'
		this.SidebarStore.sidebar_disp_flag(false)
		await sleep(1000)
		m.route.set(pathname)
	}
}
