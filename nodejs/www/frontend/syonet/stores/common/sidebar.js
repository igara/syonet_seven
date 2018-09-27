// @flow

import { stream } from '../../statics/mithril'

export type SidebarStoreType = {
	SidebarStore: {
		SidebarDispFlag: (?boolean) => boolean,
	},
}

/**
 * サイドバーを表示するフラグを管理
 */
const SidebarDispFlag = stream(false)

export default {
	SidebarDispFlag,
}
