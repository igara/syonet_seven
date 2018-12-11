// @flow
import {
	callSpreadSheetPage,
	callSpreadSheet,
} from '@F_syonet/fetchs/google/spreadsheet'
import type { StoresType } from '@F_syonet/stores'

export type VotingActionType = {}

/**
 * 投票画面のアクション
 */
export default class VotingAction {
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

	onInputSpreadSheetURL(event: SyntheticInputEvent<HTMLInputElement>) {
		this.Stores.VotingStore.SpreadSheetURL(event.target.value)
	}

	async onClickReadButton(m: mithril) {
		const spreadSheetURL = this.Stores.VotingStore.SpreadSheetURL()
		const id = spreadSheetURL
			.replace('https://docs.google.com/spreadsheets/d/', '')
			.replace('/edit#gid=0', '')
		const json = await callSpreadSheetPage(id)
		this.Stores.VotingStore.SpreadSheet.PageTitle(json.pageTitle)
		this.Stores.VotingStore.SpreadSheet.SheetTitles(json.sheetsTitles)
		m.redraw()
	}

	async onClickSheetOption(
		m: mithril,
		event: SyntheticInputEvent<HTMLInputElement>,
		sheetsTitles: Array<string>,
	) {
		const sheetsTitle = sheetsTitles.find(
			sheetsTitle => sheetsTitle === event.target.value,
		)
		if (!sheetsTitle) {
			return
		}
		const spreadSheetURL = this.Stores.VotingStore.SpreadSheetURL()
		const id = spreadSheetURL
			.replace('https://docs.google.com/spreadsheets/d/', '')
			.replace('/edit#gid=0', '')
		const json = await callSpreadSheet(id, sheetsTitle)
		console.log(json)
		this.Stores.VotingStore.SelectedSheetTitle(json.sheetsTitle)
		this.Stores.VotingStore.SelectedSheetRows(json.rows)
		m.redraw()
	}
}
