/**
 * @flow
 * @jsx m
 */

import { m } from '../../statics/mithril'
import AnalyzeImageLoadAction from '../../actions/analyze_image/load'
import { AnalyzeImageLoadStyle } from '../../statics/styles'
import File from '../../components/common/input/file'
import Button from '../../components/common/input/button'
import closeSvg from '../../images/close.svg'

/**
 * Routing URL: //analyze_image/load/${sha}
 */
export default class AnalyzeImageLoadPage {
	/**
	 * @type {Stores} Stores
	 */
	Stores: Stores

	/**
	 * @type {AnalyzeImageLoadAction} AnalyzeImageLoadAction
	 */
	AnalyzeImageLoadAction: AnalyzeImageLoadAction

	Sha: string

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: AnalyzeImageLoadPageVnode) {
		this.Stores = vnode.attrs.Stores
		this.Sha = vnode.attrs.sha
		this.AnalyzeImageLoadAction = new AnalyzeImageLoadAction(this.Stores)
	}

	async oninit() {
		this.Stores.AnalyzeImageLoadStore.Model(null)
		await this.AnalyzeImageLoadAction.callModel(this.Sha)
		m.redraw()
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		const model = this.Stores.AnalyzeImageLoadStore.Model()
		const modelData = this.Stores.AnalyzeImageListStore.List().find(
			data => data.sha === this.Sha,
		)
		const imageUrl = this.Stores.AnalyzeImageLoadStore.ImageUrl()
		return (
			<div>
				{typeof model !== 'undefined' &&
				model !== null &&
				typeof modelData !== 'undefined' &&
				modelData !== null ? (
					<div>
						<div>{modelData.name}モデルの読み込み完了しました。</div>
						<File
							Stores={this.Stores}
							OnInputHandler={(event: SyntheticInputEvent<HTMLInputElement>) =>
								this.AnalyzeImageLoadAction.onInputSelectImage(event, m)
							}
							Multiple={false}
							Accept="image/*"
						/>
						{imageUrl && (
							<div>
								<div class={AnalyzeImageLoadStyle.image_area}>
									<img src={imageUrl} class={AnalyzeImageLoadStyle.image} />
									<i
										class={AnalyzeImageLoadStyle.close_icon}
										onclick={() =>
											this.AnalyzeImageLoadAction.onClickRemoveImage()
										}
									>
										{m.trust(closeSvg)}
									</i>
								</div>
								<Button
									Stores={this.Stores}
									OnClickHandler={() =>
										this.AnalyzeImageLoadAction.onClickAnalyzeExec()
									}
								>
									画像認識実行
								</Button>
							</div>
						)}
					</div>
				) : (
					<div>モデルの読み込み中です</div>
				)}
			</div>
		)
	}
}
