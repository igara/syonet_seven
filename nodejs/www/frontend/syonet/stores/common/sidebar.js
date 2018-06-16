// @flow

import { stream } from '../../statics/mithril'

/**
 * サイドバーを表示するフラグを管理
 */
const SidebarDispFlag = stream(false)

export default {
	SidebarDispFlag,
}
