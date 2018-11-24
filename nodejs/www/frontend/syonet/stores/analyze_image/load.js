// @flow

import { stream } from '@F_syonet/statics/mithril'

export type AnalyzeImageLoadStoreType = {
	AnalyzeImageLoadStore: {
		Model: (?Object) => Object,
		ImageUrl: (url?: string) => string,
		File: (file?: File) => File,
	},
}

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
