import { ReadModelAuthorizer, ReadModelFilterHooks, UUID } from '.'
import { Class } from '../typelevel'
import { PropertyMetadata } from '@boostercloud/metadata-booster'

export interface BoosterMetadata {
  version: number
  schemaVersion: number
  optimisticConcurrencyValue?: string | number
  lastUpdateAt?: string
  lastProjectionInfo?: {
    entityId: string
    entityName: string
    entityUpdatedAt: string
    projectionMethod: string
  }
}

export interface ReadModelInterface {
  id: UUID
  boosterMetadata?: BoosterMetadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type ReadModelGraphqlQueryGeneratorConfig = 'GRAPHQL_LIST_AND_SINGLE_QUERIES' | 'GRAPHQL_LIST_QUERY' | 'GRAPHQL_SINGLE_QUERY' | 'NO_GRAPHQL_QUERIES';
export type ReadModelGraphqlSubscriptionGeneratorConfig = 'GRAPHQL_LIST_AND_SINGLE_SUBSCRIPTION' | 'GRAPHQL_LIST_SUBSCRIPTION' | 'GRAPHQL_SINGLE_SUBSCRIPTION' | 'NO_GRAPHQL_SUBSCRIPTIONS';

export interface ReadModelMetadata<TReadModel extends ReadModelInterface = ReadModelInterface> {
  readonly class: Class<ReadModelInterface>
  readonly properties: Array<PropertyMetadata>
  readonly authorizer: ReadModelAuthorizer
  readonly before: NonNullable<ReadModelFilterHooks<TReadModel>['before']>
  readonly graphqlQueryGenerationConfig: ReadModelGraphqlQueryGeneratorConfig
  readonly graphqlSubscriptionGenerationConfig: ReadModelGraphqlSubscriptionGeneratorConfig
}
