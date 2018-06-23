// @flow

export type ButtonComponentVnode = {
	attrs: {
		Stores: Stores,
		OnClickHandler: Function,
		Href: string,
	},
	children: HTMLElement,
}
