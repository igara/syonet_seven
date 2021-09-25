import { authenticate } from "@api/passport/jwt";
import { ApolloServer } from "apollo-server-lambda";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "@api/resolvers/auth";
import { WebPushResolver } from "@api/resolvers/webpush";
import { SoundResolver } from "@api/resolvers/sound";
import { ScrapingResolver } from "@api/resolvers/google/scraping";

const main = async () => {
  // https://github.com/MichalLytek/type-graphql/issues/869#issuecomment-824887201
  (global as any).schema =
    (global as any).schema ||
    (await buildSchema({
      resolvers: [
        AuthResolver,
        WebPushResolver,
        SoundResolver,
        ScrapingResolver,
      ],
    }));
  const schema = (global as any).schema;

  const apolloServer = new ApolloServer({
    schema,
    context: async ({ event }) => {
      try {
        const user = await authenticate(event, null);

        return {
          user,
        };
      } catch (e) {
        return {
          message: "auth error",
        };
      }
    },
    playground: {
      endpoint: `${process.env.API_HOST}/graphql`,
    },
  });

  return apolloServer.createHandler({
    cors: {
      origin: true,
      credentials: true,
    },
  });
};

export default main;
