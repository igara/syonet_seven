// @flow

export type LoginCheckAction = {
	setToken: (string) => void,
	callLoginCheckApi: () => Promise<void>,
}
