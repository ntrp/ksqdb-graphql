import { addResolversToSchema } from "@graphql-tools/schema";
import { KsqlDBClient } from "@ntrp/ksqldb-client";
import { ApolloServer } from "apollo-server";
import { buildKsqlDBGraphQL } from "./schema";

const ksqlDBClient = new KsqlDBClient("http://localhost:8088")

buildKsqlDBGraphQL({
  ksqlDBClient
}).then(
  ({ schemas, queryResolvers, subscriptionResolvers, mutationResolvers }) => {
    const server = new ApolloServer({
      context: async (): Promise<any> => ({
        ksqlDBClient,
      }),
      schema: addResolversToSchema({
        schema: schemas,
        resolvers: {
          //Subscription: subscriptionResolvers,
          Query: queryResolvers,
          Mutation: mutationResolvers,
        }
      }),
    });

    const options = { port: 4000, host: 'localhost' };
    const host = process.env.API_HOST;
    const port = process.env.API_PORT;
    if (host != null) {
      options.host = host;
    }
    if (port != null) {
      options.port = parseInt(port, 10);
    }

    server.listen(options).then(({ url, subscriptionsUrl }: any) => {
      // eslint-disable-next-line
      console.log(`🚀 Server ready at ${url}`);
      // eslint-disable-next-line
      console.log(`🚀 Subscriptions ready at ${subscriptionsUrl} `);
    });
  }
);
