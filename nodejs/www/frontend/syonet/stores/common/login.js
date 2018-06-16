// @flow

import { stream } from '../../statics/mithril'

/**
 * ログイン状態を管理
 */
const Status = stream('')

/**
 * ログインユーザ情報
 */
const User = stream('')

export default {
	Status,
	User,
}
