import { Entity } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Entity({
  authorizeReadEvents: 'all',
})
export class AnotherStock {
  public constructor(readonly id: UUID, readonly warehouses: Record<string, number>) {}
}
