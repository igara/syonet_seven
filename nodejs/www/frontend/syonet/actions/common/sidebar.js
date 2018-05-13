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
		this.Stores.SidebarStore.SidebarDispFlag(false)
	}

	/**
	 * 利用規約を押下したときの処理
	 */
	onClickTerm() {
		this.Stores.TermStore.TermDispFlag(true)
	}

	/**
	 * ホームを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickHome(m) {
		const pathname = '/'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * ログインを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickLogin(m) {
		const pathname = '/login'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * ログアウトを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickLogout(m) {
		await FetchLogin.callLogout(this.Stores.LoginStore.Token())
		const pathname = '/'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		this.Stores.LoginStore.Token('')
		this.Stores.LoginStore.User('')
		Cookies.remove('auth_token')
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * 利用規約を押下したときの処理
	 */
	onClickGitHub() {
		window.open('https://github.com/igara/syonet_seven')
	}
}
