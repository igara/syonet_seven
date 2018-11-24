// @flow

import { sleep } from '@www/libs/sleep'
import { callLogout } from '@F_syonet/fetchs/login'
import Cookies from '@F_syonet/statics/js_cookie'

import type { StoresType } from '@F_syonet/stores'

/**
 * サイドバーのアクション
 */
export default class SidebarAction {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @constructor
	 * @param {StoresType} Stores
	 */
	constructor(Stores: StoresType) {
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
	 * @param {Event} event
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
		const pathname = '/'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		this.Stores.LoginStore.Status(null)
		this.Stores.LoginStore.User(null)
		await callLogout()
		Cookies.remove('connect.sid')
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * ツールを押下したときの処理
	 * @param {Mithril} m
	 * @param {Event} event
	 */
	async onClickTools(m: mithril, event: Event) {
		event.preventDefault()
		const pathname = '/tools'
		this.Stores.SidebarStore.SidebarDispFlag(false)
		await sleep(1000)
		m.route.set(pathname)
	}

	/**
	 * キャッシュクリアを押下した時
	 * @param {Mithril} m
	 * @param {Event} event
	 */
	async onClickCacheClear() {
		if (typeof navigator.serviceWorker !== 'undefined') {
			const registrations = await navigator.serviceWorker.getRegistrations()
			// 登録されているworkerを全て削除する
			registrations.forEach(registration => {
				registration.unregister()
			})
			caches.keys().then(keys => {
				let promises = []
				// キャッシュストレージを全て削除する
				keys.forEach(cacheName => {
					if (cacheName) {
						promises.push(caches.delete(cacheName))
					}
				})
			})
			location.reload()
		}
	}
}
