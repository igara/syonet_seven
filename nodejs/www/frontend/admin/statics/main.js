/**
 * @flow
 * @jsx React.createElement
 */

import { React } from './react'
import { ReactDOM } from './react_dom'
import { Provider } from 'react-redux'

import store from '../reducers/store'
import Routes from '../pages/routes'

ReactDOM.render(
	<Provider store={store}>
		<Routes />
	</Provider>,
	// $FlowFixMe
	document.getElementById('root'),
)
