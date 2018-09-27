// @flow

import { stream } from '../../statics/mithril'

export type AnalyzeImageListStoreType = {
	AnalyzeImageListStore: {
		List: (
			?Array<{
				download_url: string,
				name: string,
				sha: string,
			}>,
		) => Array<{
			download_url: string,
			name: string,
			sha: string,
		}>,
	},
}

/**
 * 画像解析一覧情報
 */
const List = stream([])

export default {
	List,
}
