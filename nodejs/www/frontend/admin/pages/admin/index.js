/**
 * @flow
 * @jsx React.createElement
 */

import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}
type State = {}

class Admin extends React.Component<Props, State> {
	render() {
		return (
			<div>
				<h1>管理画面</h1>
				<Link to="/manage/user">User一覧</Link>
			</div>
		)
	}
}

export default Admin
