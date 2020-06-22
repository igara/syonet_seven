import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import passport from "passport";

export const graphqlServer = async (app: express.Express) => {
  app.use("/graphql", (req, res, next) => {
    passport.authenticate("jwt", { session: false }, async (_err, user, _info) => {
      if (user) {
        req.user = user;
      }

      next();
    })(req, res, next);
  });

  const schema = await buildSchema({
    resolvers: ["resolvers/**/*.ts"],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      const user = req.user;
      return {
        user,
      };
    },
  });

  apolloServer.applyMiddleware({ app, path: "/graphql" });
};
