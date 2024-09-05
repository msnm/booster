import { GenerationStrategy, ProjectionResult, UUID } from '@boostercloud/framework-types'
import { Projects, ReadModel } from '@boostercloud/framework-core'
import { AnotherStock } from '../entities/another-stock'

@ReadModel(
  {
    authorize: 'all',
  },
  { queryGeneration: [GenerationStrategy.NO_GRAPHQL], subscriptionGeneration: [GenerationStrategy.NO_GRAPHQL] }
)
export class AnotherStockReadModel {
  public constructor(readonly id: UUID, readonly warehouses: Record<string, number>) {}

  @Projects(AnotherStock, 'id')
  public static projectStock(entity: AnotherStock): ProjectionResult<AnotherStockReadModel> {
    return new AnotherStockReadModel(entity.id, entity.warehouses)
  }
}
