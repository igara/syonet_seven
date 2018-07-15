// @flow

export type AnalyzeImageSaveAction = {
	onClickSaveModel: () => void,
	onInputModelName: (event: SyntheticInputEvent<HTMLInputElement>) => void,
	onClickAddCategory: () => void,
	onClickCategoryName: (id: number) => void,
	onInputCategoryName: (
		event: SyntheticInputEvent<HTMLInputElement>,
		id: number,
	) => void,
	onInputCategoryFile: (
		event: SyntheticInputEvent<HTMLInputElement>,
		id: number,
		m: mithril,
	) => Promise<void>,
	readUploadedFileAsText: (file: File) => Promise<string>,
	onClickRemoveImage: (id: number, index: number) => void,
}
