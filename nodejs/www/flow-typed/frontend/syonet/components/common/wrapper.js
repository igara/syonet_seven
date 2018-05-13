// @flow

export type WrapperComponentVnode = {
	Stores: Stores,
	ChildComponent: Object,
	HeaderTitle: string,
	UserAgent: {
		browser: ?string,
		device: ?string,
	},
}
