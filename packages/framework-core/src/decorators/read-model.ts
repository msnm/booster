import {
  Class,
  ReadModelAuthorizer,
  ReadModelFilterHooks,
  ReadModelGraphqlQueryGeneratorConfig,
  ReadModelGraphqlSubscriptionGeneratorConfig,
  ReadModelInterface,
  ReadModelRoleAccess,
} from '@boostercloud/framework-types'
import { Booster } from '../booster'
import { BoosterAuthorizer } from '../booster-authorizer'
import { getClassMetadata } from './metadata'

/**
 * Decorator to register a class as a ReadModel
 * @param attributes
 */
export function ReadModel(
  attributes: ReadModelRoleAccess & ReadModelFilterHooks, graphQLQueryConfiguration: ReadModelGraphqlQueryGeneratorConfig, graphQLSubscriptionConfiguration: ReadModelGraphqlSubscriptionGeneratorConfig
): (readModelClass: Class<ReadModelInterface>, context?: ClassDecoratorContext) => void {
  return (readModelClass) => {
    Booster.configureCurrentEnv((config): void => {
      if (config.readModels[readModelClass.name]) {
        throw new Error(`A read model called ${readModelClass.name} is already registered.
        If you think that this is an error, try performing a clean build.`)
      }

      const enableAutomaticGraphQLQueryGenerationFromReadModels = config.enableAutomaticGraphQLQueryGenerationFromReadModels;
      if (enableAutomaticGraphQLQueryGenerationFromReadModels) {
        if (!graphQLQueryConfiguration) {
          graphQLQueryConfiguration = 'GRAPHQL_LIST_AND_SINGLE_QUERIES';
        }
        if (!graphQLSubscriptionConfiguration) {
          graphQLSubscriptionConfiguration = 'GRAPHQL_LIST_AND_SINGLE_SUBSCRIPTION';
        }
      }
      if (!enableAutomaticGraphQLQueryGenerationFromReadModels) {
        if (!graphQLQueryConfiguration) {
          graphQLQueryConfiguration = 'NO_GRAPHQL_QUERIES';
        }
        if (!graphQLSubscriptionConfiguration) {
          graphQLSubscriptionConfiguration = 'NO_GRAPHQL_SUBSCRIPTIONS';
        }
      }
          
      const authorizer = BoosterAuthorizer.build(attributes) as ReadModelAuthorizer
      config.readModels[readModelClass.name] = {
        class: readModelClass,
        properties: getClassMetadata(readModelClass).fields,
        authorizer,
        before: attributes.before ?? [],
        graphqlQueryGenerationConfig: graphQLQueryConfiguration,
        graphqlSubscriptionGenerationConfig: graphQLSubscriptionConfiguration,
      }
    })
  }
}
