import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { sidebarActions } from '@F_syonet/actions/common/sidebar'
import { termActions } from '@F_syonet/actions/common/term'

export interface TermState {
	TermDispFlag: boolean
}

const initialState: TermState = {
	TermDispFlag: false,
}

export const termReducer = reducerWithInitialState(initialState)
	/**
	 * 利用規約を押下したときの処理
	 */
	.case(sidebarActions.onClickTerm, state => {
		return { ...state, TermDispFlag: true }
	})
	/**
	 * 閉じるを押下したときの処理
	 */
	.case(termActions.onClickClose, state => {
		return { ...state, TermDispFlag: false }
	})
