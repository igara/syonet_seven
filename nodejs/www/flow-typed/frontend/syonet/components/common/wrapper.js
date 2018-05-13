// @flow

export type WrapperComponentVnode = {
	Stores: Stores,
	ChildComponent: string,
	HeaderTitle: string,
	UserAgent: {
		browser: ?string,
		device: ?string,
	},
}
