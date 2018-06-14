// @flow

export type SidebarAction = {
	onClickClose: () => void,
	onClickTerm: () => void,
	onClickHome: mithril => Promise<void>,
	onClickLogin: mithril => Promise<void>,
	onClickLogout: mithril => Promise<void>,
}
