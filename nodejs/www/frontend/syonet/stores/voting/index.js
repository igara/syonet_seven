// @flow

import { stream } from '@F_syonet/statics/mithril'

export type VotingStoreType = {
	VotingStore: {
		SpreadSheetURL: (?string) => string,
		SpreadSheet: {
			PageTitle: (?string) => string,
			SheetTitles: (?Array<string>) => Array<string>,
		},
		SelectedSheetTitle: (?string) => string,
		SelectedSheetRows: (?Array<Object>) => Array<Object>,
	},
}

const SpreadSheetURL = stream('')
const PageTitle = stream('')
const SheetTitles = stream([])
const SelectedSheetTitle = stream('')
const SelectedSheetRows = stream([])

export default {
	SpreadSheetURL,
	SpreadSheet: {
		PageTitle,
		SheetTitles,
	},
	SelectedSheetTitle,
	SelectedSheetRows,
}
