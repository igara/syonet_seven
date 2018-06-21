// @flow
import mongo from './index'

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
