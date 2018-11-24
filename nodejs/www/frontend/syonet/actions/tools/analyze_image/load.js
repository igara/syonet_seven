// @flow

import { callAnalyzeImageModel } from '../../../fetchs/github'

import { load, exec } from '../../../tensorflow/image'

import type { StoresType } from '../../../stores'

export type AnalyzeImageLoadActionType = {}

/**
 * 解析画面のアクション
 */
export default class AnalyzeImageLoadAction {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	MAX_SIZE = 128

	/**
	 * @constructor
	 */
	constructor(Stores: StoresType) {
		this.Stores = Stores
	}

	async callModel(sha: string) {
		const modelDir = this.Stores.AnalyzeImageListStore.List().find(
			data => data.sha === sha,
		)
		if (typeof modelDir !== 'undefined' && modelDir !== null) {
			const modelJsonUrl = `https://raw.githubusercontent.com/igara/syonet_seven_storage/master/analyze_image/${
				modelDir.name
			}/model.json`
			const model = await load(modelJsonUrl)
			this.Stores.AnalyzeImageLoadStore.Model(model)
		}
	}

	async onInputSelectImage(
		event: SyntheticInputEvent<HTMLInputElement>,
		m: mithril,
	) {
		const files: FileList = event.target.files
		if (typeof files === 'undefined' || files === null) {
			return
		}

		const file: File = files[0]
		const { imageUrl } = await this.readUploadedFileAsText(file)
		this.Stores.AnalyzeImageLoadStore.ImageUrl(imageUrl)
		this.Stores.AnalyzeImageLoadStore.File(file)
		m.redraw()
	}

	/**
	 * BASE64データを取得する
	 */
	readUploadedFileAsText(
		file: File,
	): Promise<{
		imageUrl: string,
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

				return resolve({ imageUrl })
			}
			temporaryFileReader.readAsDataURL(file)
		})
	}

	onClickRemoveImage() {
		this.Stores.AnalyzeImageLoadStore.ImageUrl('')
		this.Stores.AnalyzeImageLoadStore.File(null)
	}

	onClickAnalyzeExec() {
		const canvas = document.createElement('canvas')
		if (canvas.getContext) {
			const context = canvas.getContext('2d')
			const image = new Image()
			image.src = this.Stores.AnalyzeImageLoadStore.ImageUrl()
			image.onload = () => {
				canvas.width = this.MAX_SIZE
				canvas.height = this.MAX_SIZE
				context.drawImage(image, 0, 0, this.MAX_SIZE, this.MAX_SIZE)
				const imageData = context.getImageData(
					0,
					0,
					this.MAX_SIZE,
					this.MAX_SIZE,
				)
				exec(this.Stores, imageData)
			}
		}
	}
}
