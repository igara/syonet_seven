// @flow
import mongo from './index'

const SessionSchema = mongo.Schema(
	{
		_id: String,
		session: mongo.Schema.Types.Mixed,
		expires: Date,
	},
	{collection: 'sessions'}
)

/**
 * SessionIDからセッション情報を取得する
 * @param {String} sessionId
 * @return {GetSessionBySessionIdReturn} result
 */
SessionSchema.methods.getSessionBySessionId = async(sessionId: string): Promise<GetSessionBySessionIdReturn> => {
	const result = await Session.findOne(
		{
			'_id': sessionId,
		},
	).exec()
	return result
}

/**
 * SessionIDからセッション情報を削除する
 * @param {String} sessionId
 * @return {GetSessionBySessionIdReturn} result
 */
SessionSchema.methods.deleteSession = async(sessionId: string): Promise<Object> => {
	const result = await Session.deleteOne(
		{
			'_id': sessionId,
		},
	)
	return result
}

const Session: SessionModelType = mongo.model('Session', SessionSchema)
export default Session
