// @flow
import type { IndexModelType } from './index'

export type GetSessionBySessionIdReturn = {
	_id: string,
	session: {
		cookie: {
			originalMaxAge: number,
			expires: string,
			secure: string,
			httpOnly: boolean,
			domain: string,
			path: string,
			sameSite: string,
		},
		passport?: {
			user: {
				id: string,
				displayName: string,
				name: {
					familyName: string,
					givenName: string,
				},
				emails: Array<{
					value: string,
					type: string,
				}>,
				photos: Array<{
					value: string,
				}>,
				gender: string,
				provider: string,
				_raw: string,
				_json: {
					kind: string,
					etag: string,
					emails: Array<{
						value: string,
						type: string,
					}>,
					objectType: string,
					id: string,
					displayName: string,
					name: {
						familyName: string,
						givenName: string,
					},
					image: {
						url: string,
						isDefault: boolean,
					},
					isPlusUser: boolean,
					language: string,
					verified: boolean,
					domain: string,
				},
			},
		},
	},
}

export type SessionInfoData = {
	_id: string,
	session: {
		cookie: {
			originalMaxAge: number,
			expires: Date,
			secure: string,
			httpOnly: boolean,
			domain: string,
			path: string,
			sameSite: string,
		},
		passport?: {
			user: {
				id: string,
				displayName: string,
				name: {
					familyName: string,
					givenName: string,
				},
				emails: Array<{
					value: string,
					type: string,
				}>,
				photos: Array<{
					value: string,
				}>,
				gender: string,
				provider: string,
				_raw: string,
				_json: {
					kind: string,
					etag: string,
					emails: Array<{
						value: string,
						type: string,
					}>,
					objectType: string,
					id: string,
					displayName: string,
					name: {
						familyName: string,
						givenName: string,
					},
					image: {
						url: string,
						isDefault: boolean,
					},
					isPlusUser: boolean,
					language: string,
					verified: boolean,
					domain: string,
				},
			},
		},
	},
}

export type SessionModelType = IndexModelType & {
	getSessionBySessionId: string => Promise<GetSessionBySessionIdReturn>,
}
