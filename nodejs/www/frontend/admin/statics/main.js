/**
 * @flow
 * @jsx React.createElement
 */

import { React } from './react'
import { ReactDOM } from './react_dom'

import Routes from '../pages/routes'

ReactDOM.render(
	<Routes />,
	// $FlowFixMe
	document.getElementById('root'),
)
