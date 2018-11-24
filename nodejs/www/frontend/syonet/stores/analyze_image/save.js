// @flow

import { stream } from '@F_syonet/statics/mithril'

export type AnalyzeImageSaveStoreType = {
	AnalyzeImageSaveStore: {
		ModelName: (?string) => string,
		Category: (
			?Array<{
				id: number,
				name: string,
				images: Array<{
					imageUrl: string,
					imageRGB: Array<Array<Array<number>>>,
				}>,
			}>,
		) => Array<{
			id: number,
			name: string,
			images: Array<{
				imageUrl: string,
				imageRGB: Array<Array<Array<number>>>,
			}>,
		}>,
		SelectedCategoryID: (?number) => number,
	},
}

/**
 * モデル名
 */
const ModelName = stream('')

/**
 * モデルのカテゴリ情報を保存
 */
const Category = stream([])

/**
 * 編集中のカテゴリID
 */
const SelectedCategoryID = stream(0)

export default {
	ModelName,
	Category,
	SelectedCategoryID,
}
