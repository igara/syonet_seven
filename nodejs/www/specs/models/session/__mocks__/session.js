// @flow

let {Sessions} = require('./data/session_1')

export const setSessions = (SessionsData: Array<SessionInfoData>) => {
	Sessions = SessionsData
}

export const getSessionBySessionId = async (sessionId: string): Promise<?GetSessionBySessionIdReturn> => {
	const session = await Sessions.find(session => session._id === sessionId)
	if (
		typeof session !== 'undefined' && session !== null
	) {
		return await session
	}
	return await null
}
