// @flow

import { stream } from '../statics/mithril'

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
