// @flow
import type {IndexModelType} from './index'

export type UpsertByAuthUserParam = {
	id: string | number,
	provider: string
}

export type UserInfoData = {
	_id: string,
	auth: {
		id: string,
		username?: ?string,
		provider: string,
		displayName: string,
		name?: ?{
			familyName: string,
			givenName: string,
		},
		emails?: ?Array<{
			value: string,
			type?: ?string,
		}>,
		_json: {
			image?: {
				url: string
			}
		},
		photos: Array<{
			value: string
		}>
	},
	token: string | null
}

export type GetUserInfoReturn = {
	displayName: string,
	image: string
}

export type UserModelType = IndexModelType & {
	upsertByAuthUser: (UpsertByAuthUserParam) => string,
	deleteToken: (string) => void,
	getUserInfo: (string) => GetUserInfoReturn
}
