// @flow
import mongo from './index'

import mongoose from 'mongoose'
type IndexModelType = mongoose

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

export type DeleteSessionReturn = {
	n: number,
	ok: number,
}

export type SessionModelType = IndexModelType & {
	getSessionBySessionId: string => Promise<GetSessionBySessionIdReturn>,
	deleteSession: string => Promise<DeleteSessionReturn>,
}

const SessionSchema = mongo.Schema(
	{
		_id: String,
		session: mongo.Schema.Types.Mixed,
		expires: Date,
	},
	{ collection: 'sessions' },
)

/**
 * SessionIDからセッション情報を取得する
 * @param {String} sessionId
 * @return {GetSessionBySessionIdReturn} result
 */
export const getSessionBySessionId = async (
	sessionId: string,
): Promise<GetSessionBySessionIdReturn> => {
	const result = await Session.findOne({
		_id: sessionId,
	}).exec()
	return result
}

SessionSchema.methods.getSessionBySessionId = getSessionBySessionId

/**
 * SessionIDからセッション情報を削除する
 * @param {String} sessionId
 * @return {DeleteSessionReturn} result
 */
export const deleteSession = async (
	sessionId: string,
): Promise<DeleteSessionReturn> => {
	const result = await Session.deleteOne({
		_id: sessionId,
	})
	return result
}

SessionSchema.methods.deleteSession = deleteSession

const Session: SessionModelType = mongo.model('Session', SessionSchema)
export default Session
