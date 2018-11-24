/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import LoginCheckAction from '@F_syonet/actions/login_check'

import type { StoresType } from '@F_syonet/stores'

export type LoginCheckPageVnode = {
	attrs: {
		Stores: StoresType,
	},
}

/**
 * Routing URL: //login/check
 */
export default class LoginCheckPage {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @type {LoginCheckAction} LoginCheckAction
	 */
	LoginCheckAction: LoginCheckAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: LoginCheckPageVnode) {
		this.Stores = vnode.attrs.Stores
		this.LoginCheckAction = new LoginCheckAction(this.Stores)
	}

	/**
	 * Lifecycle: The oninit hook is called before a vnode is touched by the virtual DOM engine.
	 * @param {Vnode<A, this>} vnode
	 */
	oninit(vnode: LoginCheckPageVnode) {
		this.Stores.SidebarStore.SidebarDispFlag(false)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<div>
				{(() => {
					if (this.Stores.LoginStore.Status() === null) {
						return <div>読み込み中</div>
					} else if (this.Stores.LoginStore.Status() === 200) {
						return <div>読み込みました</div>
					} else if (this.Stores.LoginStore.Status() !== 200) {
						return <div>読み込みできませんでした</div>
					}
				})()}
			</div>
		)
	}

	/**
	 * Lifecycle: The oncreate hook is called after a DOM element is created and attached to the document.
	 * @param {Vnode<A, this>} vnode
	 */
	async oncreate(vnode: LoginCheckPageVnode) {
		await this.LoginCheckAction.callLoginCheckApi()
		m.redraw()
	}
}
