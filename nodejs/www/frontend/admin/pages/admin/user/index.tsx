import * as React from 'react'
import { callUserList } from '@www/libs/fetchs/admin'
import styled from 'styled-components'

type Props = {}
type State = {
	users: Array<{
		_id: string
		auth: {
			id: string
			displayName: string
			username: string
			profileUrl: string
			provider: string
		}
	}>
}

class User extends React.Component<Props, State> {
	state: State = {
		users: [],
	}

	componentDidMount() {
		let next = 1
		let limit = 1
		let users = []
		callUserList({ limit, next })
			.then(async json => {
				const { userCount } = json
				while (next <= userCount) {
					limit = 10
					const json = await callUserList({ limit, next })
					const { userList } = json
					users = users.concat(userList)
					next = next + 10
				}
				this.setState({ ...this.state, users })
			})
			.catch(console.error)
	}

	render() {
		return (
			<div>
				<h1>管理画面</h1>
				<h2>ユーザ一覧</h2>
				<div>
					<UserListHeaderArea>
						<div>_id</div>
						<div>id</div>
						<div>displayName</div>
						<div>username</div>
						<div>profileUrl</div>
						<div>provider</div>
					</UserListHeaderArea>
					{this.state.users.map(user => (
						<UserListContentArea key={user._id}>
							<div>{user._id}</div>
							<div>{user.auth.id}</div>
							<div>{user.auth.displayName}</div>
							<div>{user.auth.username}</div>
							<div>{user.auth.profileUrl}</div>
							<div>{user.auth.provider}</div>
						</UserListContentArea>
					))}
				</div>
			</div>
		)
	}
}

export default User

const UserListHeaderArea = styled.div`
	display: flex;
	div {
		width: calc(100vw / 6);
		word-break: break-all;
	}
`
const UserListContentArea = styled.div`
	display: flex;
	div {
		width: calc(100vw / 6);
		word-break: break-all;
	}
`
