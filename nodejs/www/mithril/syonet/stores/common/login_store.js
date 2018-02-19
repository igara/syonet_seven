import {stream} from '../../mithril'

/**
 * ログイン状態を管理
 */
const status = stream('')

/**
 * ログインユーザが保有するtoken
 */
const token = stream('')

/**
 * ログインユーザ情報
 */
const user = stream('')

export default {
	status,
	token,
	user,
}
