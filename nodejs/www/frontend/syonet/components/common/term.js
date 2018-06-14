/**
 * @flow
 * @jsx m
 */

import { m } from '../../mithril'
import { TermStyle } from '../../styles'
import TermAction from '../../actions/common/term'
import { sleep } from '../../../../libs/sleep'
import Button from './button'

/**
 * 利用規約を表示するコンポーネント
 */
export default class TermComponent {
	Stores: Stores

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
					</div>
				</div>
			</div>
		)
	}
}
