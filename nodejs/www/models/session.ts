import { Document, Schema } from 'mongoose'
import mongo from './index'

export interface SessionData {
	_id: string
	session: {
		cookie: {
			originalMaxAge: number
			expires: string
			secure: string
			httpOnly: boolean
			domain: string
			path: string
			sameSite: string
		}
		passport?: {
			user: {
				id: string
				displayName: string
				name: {
					familyName: string
					givenName: string
				}
				emails: Array<{
					value: string
					type: string
				}>
				photos: Array<{
					value: string
				}>
				gender: string
				provider: string
				_raw: string
				_json: {
					kind: string
					etag: string
					emails: Array<{
						value: string
						type: string
					}>
					objectType: string
					id: string
					displayName: string
					name: {
						familyName: string
						givenName: string
					}
					image: {
						url: string
						isDefault: boolean
					}
					isPlusUser: boolean
					language: string
					verified: boolean
					domain: string
				}
			}
		}
	}
}

export interface SessionDocument extends Document {
	_id: string
	session: {
		cookie: {
			originalMaxAge: number
			expires: string
			secure: string
			httpOnly: boolean
			domain: string
			path: string
			sameSite: string
		}
		passport?: {
			user: {
				id: string
				displayName: string
				name: {
					familyName: string
					givenName: string
				}
				emails: Array<{
					value: string
					type: string
				}>
				photos: Array<{
					value: string
				}>
				gender: string
				provider: string
				_raw: string
				_json: {
					kind: string
					etag: string
					emails: Array<{
						value: string
						type: string
					}>
					objectType: string
					id: string
					displayName: string
					name: {
						familyName: string
						givenName: string
					}
					image: {
						url: string
						isDefault: boolean
					}
					isPlusUser: boolean
					language: string
					verified: boolean
					domain: string
				}
			}
		}
	}
}

const SessionSchema: Schema = new mongo.Schema(
	{
		_id: String,
		session: mongo.Schema.Types.Mixed,
		expires: Date,
	},
	{ collection: 'sessions' },
)

/**
 * SessionIDからセッション情報を取得する
 */
export const getSessionBySessionId = async (
	sessionId: string,
): Promise<SessionDocument | null> => {
	const result = await Session.findOne({
		_id: sessionId,
	}).exec()
	return result
}

SessionSchema.methods.getSessionBySessionId = getSessionBySessionId

/**
 * SessionIDからセッション情報を削除する
 */
export const deleteSession = async (sessionId: string) => {
	const result = await Session.deleteOne({
		_id: sessionId,
	})
	return result
}

SessionSchema.methods.deleteSession = deleteSession

const Session = mongo.model<SessionDocument>('Session', SessionSchema)
export default Session
