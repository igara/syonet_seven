import Api from '../../../libs/api'

/**
 * ログインチェックのアクション
 */
export default class LoginCheckAction {

	/**
	 * {LoginCheckStore} LoginCheckStore
	 */
	LoginCheckStore

	/**
	 * @constructor
	 */
	constructor(LoginCheckStore) {
		this.LoginCheckStore = LoginCheckStore
	}

	/**
	 * ユーザのtokenを設置する
	 * @param {String} token 
	 */
	setToken(token) {
		this.LoginCheckStore.token(token.replace('#', ''))
	}

	/**
	 * ログインチェックAPIを呼び出したときの処理
	 */
	async callLoginCheckApi() {
		const result = await Api.call({
			url: `${Api.getApiHost()}/api/auth/check`,
			body: {
				token: this.LoginCheckStore.token(),
			},
			method: 'POST',
		})
		const json = await result.json()
		this.LoginCheckStore.status(json.status)
	}
}
