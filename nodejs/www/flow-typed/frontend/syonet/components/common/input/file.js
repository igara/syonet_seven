// @flow

export type FileComponentVnode = {
	attrs: {
		Stores: Stores,
		OnInputHandler: Function,
		Multiple: boolean,
		Key: string,
		Accept: string,
	},
}
