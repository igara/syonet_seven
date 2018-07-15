// @flow

import { stream } from '../../statics/mithril'

/**
 * 画像解析情報
 */
const Model = stream()

const ImageUrl = stream('')

const File = stream()

export default {
	Model,
	ImageUrl,
	File,
}
