// @flow

export type Stores = {
	HeaderStore: {
		HeaderTitle: (?string) => string,
	},
	LoginStore: {
		Status: (?number) => number,
		User: (?Object | ?string) => Object,
	},
	SidebarStore: {
		SidebarDispFlag: (?boolean) => boolean,
	},
	TermStore: {
		TermDispFlag: (?boolean) => boolean,
	},
	AnalyzeImageStore: {
		Category: (
			?Array<{
				id: number,
				name: string,
			}>,
		) => Array<{
			id: number,
			name: string,
		}>,
	},
}
