import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export const sidebarActions = {
	/**
	 * 閉じるを押下したときの処理
	 */
	onClickClose: actionCreator<boolean>("ACTIONS_SIDEBAR_ONCLICK_CLOSE"),
	/**
	 * 利用規約を押下したときの処理
	 */
	onClickTerm: actionCreator<boolean>("ACTIONS_SIDEBAR_ONCLICK_TERM"),
	/**
	 * ホームを押下したときの処理
	 */
	onClickHome: actionCreator<boolean>("ACTIONS_SIDEBAR_ONCLICK_HOME"),
	/**
	 * ログインを押下したときの処理
	 */
	onClickLogin: actionCreator<boolean>("ACTIONS_SIDEBAR_ONCLICK_LOGIN"),
	/**
	 * ログアウトを押下したときの処理
	 */
	onClickLogout: actionCreator<boolean>("ACTIONS_SIDEBAR_ONCLICK_LOGOUT"),
	/**
	 * ツールを押下したときの処理
	 */
	onClickTools: actionCreator<boolean>("ACTIONS_SIDEBAR_ONCLICK_TOOLS"),
	/**
	 * キャッシュクリアを押下した時
	 */
	onClickCacheClear: actionCreator<boolean>(
		"ACTIONS_SIDEBAR_ONCLICK_CACHE_CLEAR"
	)
};
