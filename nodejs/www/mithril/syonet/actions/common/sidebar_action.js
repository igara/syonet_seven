import sleep from '../../../../libs/sleep'
import Cookies from '../../js_cookie'
import FetchLogin from '../../fetchs/login'

/**
 * サイドバーのアクション
 */
export default class SidebarAction {

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
		this.Stores.SidebarStore.sidebar_disp_flag(false)
	}

	/**
	 * ホームを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickHome(m) {
		const pathname = '/'
		this.Stores.SidebarStore.sidebar_disp_flag(false)
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * ログインを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickLogin(m) {
		const pathname = '/login'
		this.Stores.SidebarStore.sidebar_disp_flag(false)
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * ログアウトを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickLogout(m) {
		await FetchLogin.callLogout(this.Stores.LoginStore.token())
		const pathname = '/'
		this.Stores.SidebarStore.sidebar_disp_flag(false)
		this.Stores.LoginStore.token('')
		this.Stores.LoginStore.user('')
		Cookies.remove('auth_token')
		await sleep(1000)
		m.route.set(pathname)
	}
}
