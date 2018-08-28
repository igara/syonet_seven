// @flow

import { sleep } from '../../../../libs/sleep'

/**
 * 一覧画面のアクション
 */
export default class AnalyzeImageListAction {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @constructor
	 */
	constructor(Stores: Stores) {
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
