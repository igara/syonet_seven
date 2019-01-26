import * as express from 'express'
import * as bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import {
	makeExecutableSchema,
	addMockFunctionsToSchema,
	mergeSchemas,
} from 'graphql-tools'

export const graphql = (app: express.Express) => {
	// Some fake data
	const books = [
		{
			title: "Harry Potter and the Sorcerer's stone",
			author: 'J.K. Rowling',
		},
		{
			title: 'Jurassic Park',
			author: 'Michael Crichton',
		},
	]

	// The GraphQL schema in string form
	const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`

	// The resolvers
	const resolvers = {
		Query: { books: () => books },
	}

	// Put together a schema
	const schema = makeExecutableSchema({
		typeDefs,
		resolvers,
	})

	// The GraphQL endpoint
	app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

	// GraphiQL, a visual editor for queries
	app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
}
