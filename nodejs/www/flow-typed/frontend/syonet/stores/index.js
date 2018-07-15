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
	TensorflowAnalyzeImageStore: {
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
