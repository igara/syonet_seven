/**
 * @flow
 * @jsx React.createElement
 */

import { React } from './react'
import { ReactDOM } from './react_dom'

import Routes from '@F_admin//pages/routes'

ReactDOM.render(
	<Routes />,
	// $FlowFixMe
	document.getElementById('root'),
)
