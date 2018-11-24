// @flow

import { sleep } from '@www/libs/sleep'

import type { StoresType } from '@F_syonet/stores'

export type AnalyzeImageListActionType = {}

/**
 * 一覧画面のアクション
 */
export default class AnalyzeImageListAction {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @constructor
	 */
	constructor(Stores: StoresType) {
		this.Stores = Stores
	}

	/**
	 * 対象の画像解析をクリックした時
	 * @param {Mithril} m
	 * @param {Event} event
	 * @param {String} sha
	 */
	async onClickAnalyzeImage(m: mithril, event: Event, sha: string) {
		event.preventDefault()
		const pathname = `/tools/analyze_image/load/${sha}`
		m.route.set(pathname)
	}

	async onClickSave(m: mithril, event: SyntheticInputEvent<HTMLInputElement>) {
		event.preventDefault()
		m.route.set('/tools/analyze_image/save')
	}
}
