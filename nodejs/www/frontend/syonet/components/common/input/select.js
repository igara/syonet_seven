/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import { SelectStyle } from '@F_syonet/statics/styles'

import type { StoresType } from '@F_syonet/stores'

export type SelectComponentVnode = {
	attrs: {
		Stores: StoresType,
		onchange: Function,
	},
	children: Array<{
		text: string,
		tag: string,
		children: Array<{
			text: string,
			tag: string,
		}>,
	}>,
}

export default class SelectComponent {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	onchange: Function

	Children: Array<{
		text: string,
		tag: string,
		children: Array<{
			text: string,
			tag: string,
		}>,
	}>

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: SelectComponentVnode) {
		this.Stores = vnode.attrs.Stores
		this.onchange = vnode.attrs.onchange
		this.Children = vnode.children
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		return (
			<select class={SelectStyle.select} onchange={this.onchange}>
				{this.Children.filter(child => child.tag === 'option').map(child => (
					<option key={child.text}>{child.text}</option>
				))}
				{this.Children.filter(child => child.tag === '[').map(child =>
					child.children
						.filter(child => child.tag === 'option')
						.map(child => <option key={child.text}>{child.text}</option>),
				)}
			</select>
		)
	}
}
