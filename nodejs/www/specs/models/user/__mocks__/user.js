let Users = []

export const setUsers = (UsersData) => {
	Users = UsersData
}

export const find = ({token}) => {
	return Users.filter(user => user.token === token) ? Users.filter(user => user.token === token) : []
}
