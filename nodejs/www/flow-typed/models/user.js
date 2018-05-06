// @flow
import type {IndexModelType} from './index'

export type UpsertByAuthUserParam = {
	id: string | number,
	provider: string
}

export type GetUserInfoParam = {
	id: string | number,
	provider: string,
	auth: {
		provider: string,
		displayName: string,
		_json: {
			image: {
				url: string
			}
		},
		photos: Array<{
			value: string
		}>
	}
}

export type GetUserInfoReturn = {
	displayName: string,
	image: string
}

export type UserModelType = IndexModelType & {
	upsertByAuthUser: (UpsertByAuthUserParam) => string,
	deleteToken: (string) => void,
	getUserInfo: (GetUserInfoParam) => GetUserInfoReturn
}
