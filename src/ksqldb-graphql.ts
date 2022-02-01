import express from "express";
import ws from 'ws';
import { ApolloServer } from "apollo-server-express";
import { useServer } from 'graphql-ws/lib/use/ws';
import { addResolversToSchema } from "@graphql-tools/schema";
import { KsqlDBClient } from "@ntrp/ksqldb-client";
import { buildKsqlDBGraphQL } from "./schema";
import { createServer } from "http";

const ksqlDBClient = new KsqlDBClient("http://localhost:8088");

(async function() {
  buildKsqlDBGraphQL({
    ksqlDBClient
  })
    .then(async ({ schemas, queryResolvers, subscriptionResolvers, mutationResolvers }) => {
      const app = express();

      const server = createServer(app);

      const schema = addResolversToSchema({
        schema: schemas,
        resolvers: {
          Subscription: subscriptionResolvers,
          Query: queryResolvers,
          Mutation: mutationResolvers,
        }
      })

      const apollo = new ApolloServer({
        context: async (): Promise<any> => ({
          ksqlDBClient,
        }),
        schema,
        plugins: [{
          async serverWillStart() {
            return {
              async drainServer() {
                //subscriptionServer.close();
              }
            };
          }
        }],
      });

      await apollo.start();
      apollo.applyMiddleware({ app });

      const PORT = 4000;
      server.listen({ port: PORT }, () => {

        // create and use the websocket server
        const wsServer = new ws.Server({
          server,
          path: '/graphql',
        });

        useServer({
          schema,
          context: {
            ksqlDBClient
          }
        }, wsServer);

        console.log(`\nServer ready at http://localhost:${PORT}${apollo.graphqlPath}`)
        console.log(`Subscriptions ready at ws://localhost:${PORT}${apollo.graphqlPath}`)
      });
    });
})();
