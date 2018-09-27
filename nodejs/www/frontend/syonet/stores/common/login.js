// @flow

import { stream } from '../../statics/mithril'

export type LoginStoreType = {
	LoginStore: {
		Status: (?number) => number,
		User: (?Object | ?string) => Object,
	},
}

/**
 * ログイン状態を管理
 */
const Status = stream(null)

/**
 * ログインユーザ情報
 */
const User = stream(null)

export default {
	Status,
	User,
}
