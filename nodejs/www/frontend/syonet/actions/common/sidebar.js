// @flow

import { sleep } from '../../../../libs/sleep'
import FetchLogin from '../../fetchs/login'
import Cookies from '../../js_cookie'

/**
 * サイドバーのアクション
 */
export default class SidebarAction {
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
	async onClickHome(m: mithril, event: Event) {
		event.preventDefault()
		const pathname = '/'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * ログインを押下したときの処理
	 * @param {Mithril} m
	 * @param {Event} event
	 */
	async onClickLogin(m: mithril, event: Event) {
		event.preventDefault()
		const pathname = '/login'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * ログアウトを押下したときの処理
	 * @param {Mithril} m
	 */
	async onClickLogout(m: mithril) {
		await FetchLogin.callLogout()
		const pathname = '/'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		this.Stores.LoginStore.User('')
		Cookies.remove('connect.sid')
		await sleep(1000)
		m.route.set(pathname)
	}
}
