import {
  Class,
  ReadModelAuthorizer,
  ReadModelFilterHooks,
  GenerationStrategy,
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
  queryGeneration: GenerationStrategy[] = [],
  subscriptionGeneration: GenerationStrategy[] = []
): (readModelClass: Class<ReadModelInterface>, context?: ClassDecoratorContext) => void {
  return (readModelClass) => {
    Booster.configureCurrentEnv((config): void => {
      if (config.readModels[readModelClass.name]) {
        throw new Error(`A read model called ${readModelClass.name} is already registered.
        If you think that this is an error, try performing a clean build.`)
      }

      const enableAutomaticGraphQLQueryGenerationFromReadModels =
        config.enableAutomaticGraphQLQueryGenerationFromReadModels
      if (enableAutomaticGraphQLQueryGenerationFromReadModels) {
        if (!queryGeneration) {
          queryGeneration = [GenerationStrategy.GRAPHQL_LIST, GenerationStrategy.GRAPHQL_SINGLE]
        }
        if (!subscriptionGeneration) {
          subscriptionGeneration = [GenerationStrategy.GRAPHQL_LIST, GenerationStrategy.GRAPHQL_SINGLE]
        }
      } else {
        if (!queryGeneration) {
          queryGeneration = [GenerationStrategy.NO_GRAPHQL]
        }
        if (!subscriptionGeneration) {
          subscriptionGeneration = [GenerationStrategy.NO_GRAPHQL]
        }
      }

      const authorizer = BoosterAuthorizer.build(attributes) as ReadModelAuthorizer
      config.readModels[readModelClass.name] = {
        class: readModelClass,
        properties: getClassMetadata(readModelClass).fields,
        authorizer,
        before: attributes.before ?? [],
        queryGeneration,
        subscriptionGeneration,
      }
    })
  }
}
