// @flow

import {setTokenCookie} from '../../../libs/token'
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
	 * ユーザのtokenを設置する
	 * @param {String} token 
	 */
	setToken(token: string) {
		let t = token.replace('#_=_', '')
		t = t.replace('#', '')
		this.Stores.LoginStore.Token(t)
	}

	/**
	 * ログインチェックAPIを呼び出したときの処理
	 */
	async callLoginCheckApi() {
		const json = await FetchLogin.callLoginCheck(this.Stores.LoginStore.Token())
		this.Stores.LoginStore.Status(json.status)
		if (json.status === 200) {
			this.Stores.LoginStore.User(json.user)
			setTokenCookie(this.Stores.LoginStore.Token())
		}
	}
}
