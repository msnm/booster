import {
  Class,
  ReadModelAuthorizer,
  ReadModelFilterHooks,
  ReadModelGraphqlGenerationConfig,
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
  attributes: ReadModelRoleAccess & ReadModelFilterHooks,
  graphQLGenerationConfiguration: ReadModelGraphqlGenerationConfig
): (readModelClass: Class<ReadModelInterface>, context?: ClassDecoratorContext) => void {
  return (readModelClass) => {
    Booster.configureCurrentEnv((config): void => {
      if (config.readModels[readModelClass.name]) {
        throw new Error(`A read model called ${readModelClass.name} is already registered.
        If you think that this is an error, try performing a clean build.`)
      }

      const enableAutomaticGraphQLQueryGenerationFromReadModels = config.enableAutomaticGraphQLQueryGenerationFromReadModels;
      if (enableAutomaticGraphQLQueryGenerationFromReadModels) {
        if (!graphQLGenerationConfiguration.queryGeneration) {
          graphQLGenerationConfiguration.queryGeneration = 'GRAPHQL_LIST_AND_SINGLE'
        }
        if (!graphQLGenerationConfiguration.subscriptionGeneration) {
          graphQLGenerationConfiguration.subscriptionGeneration = 'GRAPHQL_LIST_AND_SINGLE'
        }
      } else {
        if (!graphQLGenerationConfiguration.queryGeneration) {
          graphQLGenerationConfiguration.queryGeneration = 'NO_GRAPHQL'
        }
        if (!graphQLGenerationConfiguration.subscriptionGeneration) {
          graphQLGenerationConfiguration.subscriptionGeneration = 'NO_GRAPHQL'
        }
      }

      const authorizer = BoosterAuthorizer.build(attributes) as ReadModelAuthorizer
      config.readModels[readModelClass.name] = {
        class: readModelClass,
        properties: getClassMetadata(readModelClass).fields,
        authorizer,
        before: attributes.before ?? [],
        graphqlGenerationConfig: graphQLGenerationConfiguration,
      }
    })
  }
}
