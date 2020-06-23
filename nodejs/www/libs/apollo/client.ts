import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { db } from "@www/models/dexie/db";

const httpLink = new HttpLink({
  uri: `${process.env.WWW_HOST}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const accessTokens = await db.access_tokens.toArray();
  const token = accessTokens.length > 0 ? accessTokens[0].token : "";

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
