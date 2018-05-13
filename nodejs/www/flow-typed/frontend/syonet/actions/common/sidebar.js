// @flow

export type SidebarAction = {
	onClickClose: () => void,
	onClickTerm: () => void,
	onClickHome: (mithril) => void,
	onClickLogin: (mithril) => void,
	onClickLogout: (mithril) => void,
	onClickGitHub: () => void,
}
