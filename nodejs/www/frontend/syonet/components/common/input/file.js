/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import { ButtonStyle } from '@F_syonet/statics/styles'

import type { StoresType } from '@F_syonet/stores'

export type FileComponentVnode = {
	attrs: {
		Stores: StoresType,
		OnInputHandler: Function,
		Multiple: boolean,
		Key: string,
		Accept: string,
	},
}

/**
 * ファイル入力を表示するコンポーネント
 */
export default class FileComponent {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * propsで渡されてきた入力フォームの変更時のイベントハンドラ
	 * @type {Function} OnInputHandler
	 */
	OnInputHandler: Function

	/**
	 * 複数画像のアップロードを許可するとか
	 * @type {boolean} Multiple
	 */
	Multiple: boolean

	/**
	 * @type {String} Key
	 */
	Key: string

	/**
	 * ファイルの指定
	 * @type {String} Accept
	 */
	Accept: string

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: FileComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.OnInputHandler = vnode.attrs.OnInputHandler
		this.Multiple = vnode.attrs.Multiple
		this.Key = vnode.attrs.Key
		this.Accept = vnode.attrs.Accept
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<button class={ButtonStyle.button}>
				<label htmlFor={`file_${this.Key}`}>
					＋写真を選択
					{this.Multiple === true ? (
						<input
							type="file"
							oninput={this.OnInputHandler}
							multiple
							style="display:none;"
							id={`file_${this.Key}`}
							accept={this.Accept}
						/>
					) : (
						<input
							type="file"
							oninput={(event: SyntheticInputEvent<HTMLInputElement>) =>
								this.OnInputHandler(event)
							}
							style="display:none;"
							id={`file_${this.Key}`}
							accept={this.Accept}
						/>
					)}
				</label>
			</button>
		)
	}
}
