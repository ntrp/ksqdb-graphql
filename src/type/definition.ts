import {
  GraphQLFieldResolver,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLResolveInfo,
  GraphQLFieldConfigMap,
} from 'graphql'
import { KsqlDBClient } from 'ksqldb-rx-client'
import { SourceDescription } from 'ksqldb-rx-client/dist/types/api/ksql/source-description'

export interface KSqlDBEntities {
  [key: string]: {
    type: GraphQLObjectType | GraphQLScalarType
  }
}

type KsqDBContext = { ksqlDBClient: KsqlDBClient }

export interface Config {
  ksqlDBClient: KsqlDBClient
  streamsFilter?: (sourceDescription: SourceDescription) => boolean
  tablesFilter?: (sourceDescription: SourceDescription) => boolean
}

export interface Resolver {
  [key: string]: GraphQLFieldResolver<void, KsqDBContext>
}
export interface SubscriptionResolver {
  [name: string]: {
    subscribe: (
      obj: void,
      args: { [key: string]: string },
      context: KsqDBContext,
      info: GraphQLResolveInfo
    ) => void
  }
}

export type KsqlDBGraphResolver = GraphQLFieldResolver<
  void,
  KsqDBContext,
  { [argName: string]: string }
>

export type ResolverFields = {
  queryFields: GraphQLFieldConfigMap<any, any>
  subscriptionFields: GraphQLFieldConfigMap<any, any>
  mutationFields: GraphQLFieldConfigMap<any, any>
}
