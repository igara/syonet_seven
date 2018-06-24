// @flow

export type AnalyzeImageAction = {
	onClickSaveModel: () => Promise<void>,
	onInputModelName: (event: Event) => Promise<void>,
	onClickAddCategory: () => Promise<void>,
	onInputCategoryName: (event: Event, id: number) => Promise<void>,
}
