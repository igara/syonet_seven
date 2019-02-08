import actionCreatorFactory from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'
import { callLoginCheck, callLogout } from '@www/libs/fetchs/login'

export interface Login {
	status: number
	user: { image: string; displayName: string } | null
}

const actionCreator = actionCreatorFactory()
const createAsync = asyncFactory<Login>(actionCreator)

export const checkLogin = createAsync('THUNKS_LOGIN_CHECK_LOGIN', async () => {
	try {
		const json = await callLoginCheck()
		return json
	} catch (error) {
		throw new Error(error)
	}
})

export const logout = createAsync('THUNKS_LOGIN_LOGOUT', async () => {
	try {
		const json = await callLogout()
		return json
	} catch (error) {
		throw new Error(error)
	}
})
