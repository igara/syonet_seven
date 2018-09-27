// @flow
import { save } from '../../tensorflow/image'

import type { StoresType } from '../../stores'

/**
 * 画像認識画面のアクション
 */
export default class AnalyzeImageSaveAction {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	MAX_SIZE = 128
	ACCURACY = 1

	/**
	 * @constructor
	 */
	constructor(Stores: StoresType) {
		this.Stores = Stores
	}

	async onClickList(m: mithril, event: SyntheticInputEvent<HTMLInputElement>) {
		event.preventDefault()
		m.route.set('/tools/analyze_image')
	}

	/**
	 * モデル保存ボタンを押下したときの処理
	 */
	async onClickSaveModel() {
		await save(this.Stores)
	}

	/**
	 * モデル名を変更したときの処理
	 */
	onInputModelName(event: SyntheticInputEvent<HTMLInputElement>) {
		const name = event.target.value
		this.Stores.AnalyzeImageSaveStore.ModelName(name)
	}

	/**
	 * カテゴリ追加を押下したときの処理
	 */
	onClickAddCategory() {
		const category = this.Stores.AnalyzeImageSaveStore.Category().map(
			category => category,
		)
		const id = category.length
		category.push({
			id: id,
			name: `無題${id}`,
			images: [],
		})
		this.Stores.AnalyzeImageSaveStore.Category(category)
	}

	/**
	 * カテゴリ名を押下したときの処理
	 */
	onClickCategoryName(id: number) {
		this.Stores.AnalyzeImageSaveStore.SelectedCategoryID(id)
	}

	/**
	 * カテゴリ名を変更したときの処理
	 */
	onInputCategoryName(
		event: SyntheticInputEvent<HTMLInputElement>,
		id: number,
	) {
		const name = event.target.value
		const category = this.Stores.AnalyzeImageSaveStore.Category().reduce(
			(accumulator, currentValue) => {
				if (id === currentValue.id) {
					accumulator.push({
						...currentValue,
						name,
					})
				} else {
					accumulator.push(currentValue)
				}
				return accumulator
			},
			[],
		)
		this.Stores.AnalyzeImageSaveStore.Category(category)
	}

	/**
	 * カテゴリの画像をあげようとしたとき
	 */
	async onInputCategoryFile(
		event: SyntheticInputEvent<HTMLInputElement>,
		id: number,
		m: mithril,
	) {
		const files: FileList = event.target.files
		if (typeof files === 'undefined' || files === null || files === '') {
			return
		}

		let fileList: Array<File> = []
		for (let i = 0; i < files.length; i++) {
			fileList.push(files[i])
		}

		const images: Array<{
			imageUrl: string,
			imageRGB: Array<Array<Array<number>>>,
		}> = await Promise.all(
			fileList.map((file: File) => {
				try {
					return this.readUploadedFileAsText(file)
				} catch (error) {
					console.error(error)
					return { imageUrl: '', imageRGB: [] }
				}
			}),
		)

		const category: Array<{
			id: number,
			name: string,
			images: Array<{
				imageUrl: string,
				imageRGB: Array<Array<Array<number>>>,
			}>,
		}> = this.Stores.AnalyzeImageSaveStore.Category().reduce(
			(accumulator, currentValue) => {
				if (id === currentValue.id) {
					if (
						typeof currentValue.images === 'undefined' ||
						currentValue.images === null ||
						currentValue.images.length === 0
					) {
						accumulator.push({
							...currentValue,
							images: images,
						})
					} else {
						accumulator.push({
							...currentValue,
							images: currentValue.images.concat(images),
						})
					}
				} else {
					accumulator.push(currentValue)
				}
				return accumulator
			},
			[],
		)
		this.Stores.AnalyzeImageSaveStore.Category(category)
		console.log(this.Stores.AnalyzeImageSaveStore.Category())
		m.redraw()
	}

	/**
	 * BASE64データを取得する
	 */
	readUploadedFileAsText(
		file: File,
	): Promise<{
		imageUrl: string,
		imageRGB: Array<Array<Array<number>>>,
	}> {
		const temporaryFileReader = new FileReader()

		return new Promise(async (resolve, reject) => {
			temporaryFileReader.onload = () => {
				let imageUrl = ''
				if (typeof temporaryFileReader.result === 'string') {
					imageUrl = temporaryFileReader.result
				} else {
					imageUrl = String.fromCharCode.apply(
						'',
						new Uint16Array(temporaryFileReader.result),
					)
				}
				const canvas = document.createElement('canvas')
				if (canvas.getContext) {
					const context = canvas.getContext('2d')
					const image = new Image()
					image.src = imageUrl
					image.onload = () => {
						canvas.width = this.MAX_SIZE
						canvas.height = this.MAX_SIZE
						context.drawImage(image, 0, 0, this.MAX_SIZE, this.MAX_SIZE)
						const imageRGB = [[], [], []]
						for (let x = 0; x < this.MAX_SIZE; x += this.ACCURACY) {
							const r = []
							const g = []
							const b = []
							for (let y = 0; y < this.MAX_SIZE; y += this.ACCURACY) {
								const rgbaData = context.getImageData(x, y, 1, 1).data
								r.push(rgbaData[0] / 255)
								g.push(rgbaData[1] / 255)
								b.push(rgbaData[2] / 255)
							}
							imageRGB[0].push(r)
							imageRGB[1].push(g)
							imageRGB[2].push(b)
						}
						return resolve({ imageUrl, imageRGB })
					}
				}
			}
			temporaryFileReader.readAsDataURL(file)
		})
	}

	/**
	 * 上げた画像のバツボタンを押下した時の処理
	 */
	onClickRemoveImage(id: number, index: number) {
		const category = this.Stores.AnalyzeImageSaveStore.Category().map(
			category => {
				if (id === category.id) {
					return {
						...category,
						images: category.images.filter((image, idx) => index !== idx),
					}
				}
				return category
			},
		)
		this.Stores.AnalyzeImageSaveStore.Category(category)
	}
}
