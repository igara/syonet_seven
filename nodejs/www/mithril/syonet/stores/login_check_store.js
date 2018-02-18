import {stream} from '../vendor'

/**
 * ログイン状態を管理
 */
const status = stream('')

/**
 * ログインユーザが保有するtoken
 */
const token = stream('')

export default {
	status,
	token,
}
