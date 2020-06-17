import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

export const graphqlServer = async (app: express.Express) => {
  const schema = await buildSchema({
    resolvers: ["resolvers/**/*.ts"],
  });

  const apolloServer = new ApolloServer({ schema });

  apolloServer.applyMiddleware({ app, path: "/graphql" });
};
