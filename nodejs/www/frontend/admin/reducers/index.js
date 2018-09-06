// @flow
import { combineReducers } from 'redux'

import user from './data/user'

const data = combineReducers({
	user,
})

export default combineReducers({
	data,
})
