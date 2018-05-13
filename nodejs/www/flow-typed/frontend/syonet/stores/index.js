// @flow

export type Stores = {
	HeaderStore: {
		HeaderTitle: (?string) => string,
	},
	LoginStore: {
		Status: (?Object) => Object,
		Token: (?string) => string,
		User: (?Object | ?string) => Object,
	},
	SidebarStore: {
		SidebarDispFlag: (?boolean) => boolean,
	},
	TermStore: {
		TermDispFlag: (?boolean) => boolean,
	},
}
