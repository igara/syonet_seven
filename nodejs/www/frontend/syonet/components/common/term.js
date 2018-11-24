/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import { TermStyle } from '@F_syonet/statics/styles'
import TermAction from '@F_syonet/actions/common/term'
import { sleep } from '@www/libs/sleep'
import Button from './input/button'

import type { StoresType } from '@F_syonet/stores'

export type TermComponentVnode = {
	attrs: {
		Stores: StoresType,
	},
	dom: {
		classList: {
			add: Object => void,
		},
	},
}

/**
 * 利用規約を表示するコンポーネント
 */
export default class TermComponent {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @type {TermAction} TermAction
	 */
	TermAction: TermAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: TermComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.TermAction = new TermAction(this.Stores)
	}

	/**
	 * Lifecycle: The onbeforeupdate hook is called before a vnode is diffed in a update.
	 * @param {Vnode<A, this>} vnode
	 */
	async onbeforeremove(vnode: TermComponentVnode) {
		vnode.dom.classList.add(TermStyle.term_exit)
		return await sleep(1000)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div class={TermStyle.term_wrap_div}>
				<div class={TermStyle.term_overlay_div}>
					<div class={TermStyle.term_content}>
						<Button
							Stores={this.Stores}
							OnClickHandler={this.TermAction.onClickClose}
						>
							閉じる
						</Button>
						<div>利用規約</div>
						<div>利用上の留意事項</div>
						<ul>
							<li>状態保持の機構としてCookiesを使用しております。</li>
							<li>
								本サイトのログイン機能としてSNSを使用した認証を行なっています。
								その際、SNSのアカウントに紐づいた情報を取得させていただきますので同意の元、ご利用をよろしくお願い致します。
							</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}
