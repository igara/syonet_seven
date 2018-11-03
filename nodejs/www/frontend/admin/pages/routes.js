/**
 * @flow
 * @jsx React.createElement
 */

import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './admin'
import User from './admin/user'

import { injectGlobal } from 'styled-components'

injectGlobal`
  html {
    height: 100%;
    width: 100%;
		body {
			height: 100%;
	    width: 100%;
  	  font-size: 2vh;
			margin: 0;
		}
  }
`

const mapStateToProps = state => {
	return {}
}

const Routes = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/manage" component={Home} />
				<Route exact path="/manage/user" component={User} />
			</Switch>
		</BrowserRouter>
	)
}

export default connect(mapStateToProps)(Routes)
