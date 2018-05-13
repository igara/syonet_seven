import Api from '../../../libs/api'
import Token from '../../../libs/token'
import FetchLogin from '../fetchs/login'

/**
 * ログインチェックのアクション
 */
export default class LoginCheckAction {

	/**
	 * {LoginStore} LoginStore
	 */
	LoginStore

	/**
	 * @constructor
	 */
	constructor(LoginStore) {
		this.LoginStore = LoginStore
	}

	/**
	 * ユーザのtokenを設置する
	 * @param {String} token 
	 */
	setToken(token) {
		let t = token.replace('#_=_', '')
		t = t.replace('#', '')
		this.LoginStore.Token(t)
	}

	/**
	 * ログインチェックAPIを呼び出したときの処理
	 */
	async callLoginCheckApi() {
		const json = await FetchLogin.callLoginCheck(this.LoginStore.Token())
		this.LoginStore.Status(json.status)
		if (json.status === 200) {
			this.LoginStore.User(json.user)
			Token.setTokenCookie(this.LoginStore.Token())
		}
	}
}
