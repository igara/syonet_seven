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
	AnalyzeImageListStore: {
		List: (
			?Array<{
				download_url: string,
				name: string,
				sha: string,
			}>,
		) => Array<{
			download_url: string,
			name: string,
			sha: string,
		}>,
	},
	AnalyzeImageLoadStore: {
		Model: (?Object) => Object,
		ImageUrl: (url?: string) => string,
		File: (file?: File) => File,
	},
}
