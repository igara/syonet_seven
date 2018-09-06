/**
 * @flow
 * @jsx React.createElement
 */

import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './admin'

const mapStateToProps = state => {
	return {}
}

const Routes = () => {
	return (
		<BrowserRouter>
			<Route exact path="/admin" component={Home} />
		</BrowserRouter>
	)
}

export default connect(mapStateToProps)(Routes)
