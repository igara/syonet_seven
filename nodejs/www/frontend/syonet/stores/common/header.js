// @flow

import { stream } from '../../statics/mithril'

export type HeaderStoreType = {
	HeaderStore: {
		HeaderTitle: (?string) => string,
	},
}

/**
 * ヘッダーに表示する文言
 */
const HeaderTitle = stream(null)

export default {
	HeaderTitle,
}
