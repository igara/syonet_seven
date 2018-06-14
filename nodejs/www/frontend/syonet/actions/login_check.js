// @flow

import FetchLogin from '../fetchs/login'

/**
 * ログインチェックのアクション
 */
export default class LoginCheckAction {
	Stores: Stores

	/**
	 * @constructor
	 */
	constructor(Stores: Stores) {
		this.Stores = Stores
	}

	/**
	 * ログインチェックAPIを呼び出したときの処理
	 */
	async callLoginCheckApi() {
		const json = await FetchLogin.callLoginCheck()
		this.Stores.LoginStore.Status(json.status)
		if (json.status === 200) {
			this.Stores.LoginStore.User(json.user)
		}
	}
}
