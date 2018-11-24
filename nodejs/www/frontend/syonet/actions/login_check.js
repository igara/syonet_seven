// @flow

import { callLoginCheck } from '@F_syonet/fetchs/login'

import type { StoresType } from '@F_syonet/stores'

/**
 * ログインチェックのアクション
 */
export default class LoginCheckAction {
	Stores: StoresType

	/**
	 * @constructor
	 */
	constructor(Stores: StoresType) {
		this.Stores = Stores
	}

	/**
	 * ログインチェックAPIを呼び出したときの処理
	 */
	async callLoginCheckApi() {
		const json = await callLoginCheck()
		this.Stores.LoginStore.Status(json.status)
		if (json.status === 200) {
			this.Stores.LoginStore.User(json.user)
		}
	}
}
