// @flow
import { handleActions } from 'redux-actions'

// import {
// 	ACCOUNT_INFO_FETCH_BEGIN,
// 	ACCOUNT_INFO_FETCHED,
// 	ACCOUNT_INFO_FETCH_FAILED,
// } from '../actionTypes'

const initialState = {
	error: false,
	errorMessage: null,
	name: 'N/A',
	company: {
		name: 'N/A',
	},
	isFetching: false,
}

const reducer = handleActions(
	{
		[1111]: state => ({
			...state,
			error: false,
			errorMessage: null,
			isFetching: true,
		}),
	},
	initialState,
)

export default reducer
