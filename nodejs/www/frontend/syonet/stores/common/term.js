// @flow

import { stream } from '../../statics/mithril'

export type TermStoreType = {
	TermStore: {
		TermDispFlag: (?boolean) => boolean,
	},
}

/**
 * 利用規約を表示するフラグを管理
 */
const TermDispFlag = stream(false)

export default {
	TermDispFlag,
}
