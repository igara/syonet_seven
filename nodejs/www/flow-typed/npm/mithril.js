// @flow

declare var React: $Exports<'react'>

export type mithril = {
	route: {
		set: string => void,
	},
	redraw: () => void,
}
