// @flow

import { stream } from '@F_syonet/statics/mithril'

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
