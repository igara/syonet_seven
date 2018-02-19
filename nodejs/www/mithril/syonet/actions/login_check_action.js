import Api from '../../../libs/api'
import Token from '../../../libs/token'

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
		this.LoginStore.token(token.replace('#', ''))
	}

	/**
	 * ログインチェックAPIを呼び出したときの処理
	 */
	async callLoginCheckApi() {
		const result = await Api.call({
			url: `${Api.getApiHost()}/api/auth/check`,
			body: {
				token: this.LoginStore.token(),
			},
			method: 'POST',
		})
		const json = await result.json()
		this.LoginStore.status(json.status)
		if (json.status === 200) {
			Token.setTokenCookie(this.LoginStore.token())
		}
	}
}
