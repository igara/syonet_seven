// @flow

export type TermComponentVnode = {
	attrs: {
		Stores: Stores,
	},
	dom: {
		classList: {
			add: Object => void,
		},
	},
}
