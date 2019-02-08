import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { footerActions } from '@F_syonet/actions/common/footer'
import { sidebarActions } from '@F_syonet/actions/common/sidebar'

export interface SidebarState {
	SidebarDispFlag: boolean
}

const initialState: SidebarState = {
	SidebarDispFlag: false,
}

export const sidebarReducer = reducerWithInitialState(initialState)
	/**
	 * LinkIconを押下したときの処理
	 */
	.case(footerActions.onClickLinkIcon, state => {
		return { ...state, SidebarDispFlag: true }
	})
	/**
	 * 閉じるを押下したときの処理
	 */
	.case(sidebarActions.onClickClose, state => {
		return { ...state, SidebarDispFlag: false }
	})
	/**
	 * ホームを押下したときの処理
	 */
	.case(sidebarActions.onClickHome, state => {
		return { ...state, SidebarDispFlag: false }
	})
	/**
	 * ログインを押下したときの処理
	 */
	.case(sidebarActions.onClickLogin, state => {
		return { ...state, SidebarDispFlag: false }
	})
	/**
	 * ログアウトを押下したときの処理
	 */
	.case(sidebarActions.onClickLogout, state => {
		return { ...state, SidebarDispFlag: false }
	})
	/**
	 * ツールを押下したときの処理
	 */
	.case(sidebarActions.onClickTools, state => {
		return { ...state, SidebarDispFlag: false }
	})
	/**
	 * キャッシュクリアを押下した時
	 */
	.case(sidebarActions.onClickCacheClear, state => {
		return { ...state, SidebarDispFlag: false }
	})
