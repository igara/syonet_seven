/**
 * @flow
 * @jsx m
 */

import { m } from '@F_syonet/statics/mithril'
import VotingAction from '@F_syonet/actions/tools/voting'
import Text from '@F_syonet/components/common/input/text'
import Button from '@F_syonet/components/common/input/button'
import Select from '@F_syonet/components/common/input/select'

import type { StoresType } from '@F_syonet/stores'

export type VotingPageVnode = {
	attrs: {
		Stores: StoresType,
	},
}

/**
 * Routing URL: //tools/voting/
 */
export default class VotingPage {
	/**
	 * @type {StoresType} Stores
	 */
	Stores: StoresType

	/**
	 * @type {VotingAction} VotingAction
	 */
	VotingAction: VotingAction

	/**
	 * @constructor
	 * @param {Vnode<A, this>} vnode
	 */
	constructor(vnode: VotingPageVnode) {
		this.Stores = vnode.attrs.Stores
		this.VotingAction = new VotingAction(this.Stores)
	}

	/**
	 * Lifecycle: Creates a view out of virtual elements.
	 */
	view() {
		const sheetsTitles = this.Stores.VotingStore.SpreadSheet.SheetTitles()
		return (
			<div>
				<div>投票ツール</div>
				<Text
					OnInputHandler={(event: SyntheticInputEvent<HTMLInputElement>) =>
						this.VotingAction.onInputSpreadSheetURL(event)
					}
					Placeholder="SpredSheet URL"
				/>
				<Button
					OnClickHandler={() => this.VotingAction.onClickReadButton(m)}
					Stores={this.Stores}
				>
					読み取る
				</Button>
				{sheetsTitles.length > 0 ? (
					<Select
						onchange={event => {
							this.VotingAction.onClickSheetOption(m, event, sheetsTitles)
						}}
					>
						<option>選択</option>
						{sheetsTitles.map(sheetsTitle => (
							<option key={sheetsTitle}>{sheetsTitle}</option>
						))}
					</Select>
				) : null}
			</div>
		)
	}
}
